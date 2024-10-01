# Overview {: data-level="all"}

We discuss here how to implement dynamic rate control using [GPAC Filters](Filters). Examples are in Python but API is also available for [JSF](jsfilter) and [NodeJS](nodejs). 

You will need two instances of GPAC, one for the client and one for the encoder/sender.


# RTP Example

In this example we will use RTP as delivery mechanism and monitor loss rate of client.

## RTP reader

The reader is a regular video playback from RTP (using SDP as input). We will:

- locate the `rtpin` filter in the chain, i.e. the first filter after the `fin`filter used for SDP access
- update every 2 second the `loss_rate`option of the `rtpin` filter: this will force the loss ratio in RTCP Receiver Reports, but will not drop any packet at the receiver side

```
#file rtp_receiver.py

import types
import libgpac as gpac
import sys


#create a session, blacklisting vtbdec
fs = gpac.FilterSession(0)

#load a source
src = fs.load_src("session.sdp")
disp = fs.load("vout")


#update loss report of RTP source
def update_loss(self):
	if (self.session.last_task):
		return -1

	if self.rtpin==None:
		if src.nb_opid > 0:
			outputs = src.opid_sinks(0)
			if len(outputs):
				self.rtpin = outputs[0]

	if self.rtpin:
		self.loss_rate+=self.inc
		if self.loss_rate>=1000:
			self.inc=-100
			self.loss_rate=1000
		elif self.loss_rate<=0:
			self.inc=+100
			self.loss_rate=0

		print('Update source loss rate to ' + str(self.loss_rate));
		self.rtpin.update("loss_rate", ""+str(self.loss_rate), 0);

	return 2000

#create the custom task
task = gpac.FilterTask('loss')
task.execute = types.MethodType(update_loss, task)
task.rtpin=None
task.loss_rate=0
task.inc=100
fs.post(task)

#run the session in blocking mode
fs.run()

print('done')

fs.delete()
gpac.close()

```

## Encoder and RTP sender

The encoder consists in a source (here a single video file playing in loop), an AVC encoder and an RTP output. We will:

- locate the `rtpout` filter in the chain, i.e. the first filter before the `fout` filter used for SDP output
- monitor every 2 second the statistics of the input PID of `rtpout` to get the real-time measurements reported by RTCP
- adjust encoder max rate based on the percentage of loss packets

```
#file rtp_sender.py
import types
import libgpac as gpac
import sys

#create a session, blacklisting vtbdec
fs = gpac.FilterSession(0)

#load a source, single video in our example
src = fs.load("flist:srcs=av1.mp4#video:floop=-1")
enc = fs.load("c=avc:maxrate=8M:bufsize=2M")
out = fs.load_dst("session.sdp")
out.set_source(enc);

def update_stats(low_q, stats):
	cur_lq=False
	if stats.loss_rate<500:
		cur_lq = True

	if cur_lq == low_q:
		return low_q

	q = 8000000
	if cur_lq:
		q = 100000
	enc.update("maxrate", str(q))
	print('Updating quality to ' + str(q))
	return cur_lq


#custom task callback for checking rtp quality reports
def check_quality(self):
	if (self.session.last_task):
		return -1

	if self.rtpout==None:
		if out.nb_ipid > 0:
			self.rtpout = out.ipid_source(0)

	if self.rtpout:
		stats = self.rtpout.ipid_stats(0);
		if stats!=None:
			self.low_q = update_stats(self.low_q, stats)
	return 2000

#create the custom task
task = gpac.FilterTask('stats')
task.execute = types.MethodType(check_quality, task)
task.rtpout=None
task.low_q=False
fs.post(task)

#run the session in blocking mode
fs.run()

print('done')

fs.delete()
gpac.close()

```


## Running the demo

```
#in term1
python rtp_sender.py
#in term2
python rtp_receiver.py

```

You should see the video quality updated in realtime, from clean to really bad depending on your input resolution - in this example, the quality is either 8mbps or 100kbps.


# HTTP Example

In this example we will use HTTP as delivery mechanism and monitor throughput of client.

## HTTP reader

The reader is a regular video playback from HTTP, the client hosting the web server. We will update the overall http rate limit every 4 second.


```
#file http_receiver.py

import types
import libgpac as gpac
import sys

#create a session, blacklisting vtbdec
fs = gpac.FilterSession(0)

#load a source
src = fs.load("httpout:dst=http://127.0.0.1:8080/:hmode=source:reqlog=*")
disp = fs.load("vout")


#custom task callback for inspection of filters
def update_rate(self):
	if (self.session.last_task):
		return -1

	self.high_r = not self.high_r
	rate = 200000
	if self.high_r:
		rate = 10000000

	print('Update http read rate to ' + str(rate));
	fs.http_max_bitrate = rate
	return 6000

#create the custom task
task = gpac.FilterTask('rate')
task.execute = types.MethodType(update_rate, task)
task.high_r=False
fs.post(task)

#run the session in blocking mode
fs.run()

print('done')

fs.delete()
gpac.close()

```

## Encoder and HTTP sender

The encoder consists in a source (here a single video file playing in loop), an AVC encoder and an HTTP output in push mode.

We will monitor every 2 second the statistics of the input PID to the HTTP sink and adjust encoder max rate based on the throughput.


```
#file http_sender.py

import types
import libgpac as gpac
import sys

#create a session, blacklisting vtbdec
fs = gpac.FilterSession(0)

#load a source, single video in our example
src = fs.load("flist:srcs=av1.mp4#video:floop=-1")
enc = fs.load("c=avc:maxrate=8M:bufsize=2M")
out = fs.load("httpout:dst=http://127.0.0.1:8080/live.264:gpac:hmode=push")
out.set_source(enc);

def update_stats(low_q, stats):
	print('Stats process rate ' + str(stats.average_process_rate) + ' media rate ' + str(stats.average_bitrate))
	cur_q=False
	if stats.average_process_rate < stats.average_bitrate:
		cur_q = True

	if cur_q == low_q:
		return low_q

	q = 8000000
	if cur_q:
		q = 100000
	enc.update("maxrate", str(q))
	print('Updating quality to ' + str(q))
	return cur_q


#custom task callback for checking rtp quality reports
def check_quality(self):
	if (self.session.last_task):
		return -1

	if out.nb_ipid > 0:
		stats = out.ipid_stats(0);
		if stats!=None:
			self.low_q = update_stats(self.low_q, stats)
	return 1000

#create the custom task
task = gpac.FilterTask('stats')
task.execute = types.MethodType(check_quality, task)
task.low_q=False
fs.post(task)

#run the session in blocking mode
fs.run()

print('done')

fs.delete()
gpac.close()

```

## Running the demo

```
#in term1
python http_sender.py
#in term2
python http_receiver.py

```

You should see the video quality updated in realtime, from clean to really bad depending on your input resolution - in this example, the quality is either 8mbps or 100kbps.


# Remarks

The rate adaptation logic shown in these examples is more than basic, you may want to smooth statistics, use a bitstream ladder for the encoder, etc...

We used VBR rate control in this example, but other modes can be used depending on the underlying encoder used.
To check which parameters of your encoder can be updated:

`gpac -hx ffenc | grep updatable`: list all generic encoder options in ffenc that can be updated at run time


`gpac -hx ffenc:libx264 | grep updatable`: list all per-codec options in ffenc that can be updated at run time
 
_Warning: There is no guarantee that an updatable option in ffenc (or in ffmpeg in general) is taken into account at run-time. You can force encoder reloading using [`rld`](ffenc#rld) option of ffenc, but this will likely increase latency._

 
