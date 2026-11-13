---
tags:
- rmt
- websocket
- session
- filter
- graph
- pid
- log
- metrics
- pipeline
- widget
- history
---

# Before you start {:data-level="all"}

This tutorial starts where [Remote monitoring](remote-monitoring) stops. You know how to start a session with `-rmt` and open the monitoring interface; here you learn to read what it shows, step by step, on a real session.

Start the encoding and DASH packaging example of that page and keep it running during the whole tutorial:

```bash
gpac -i file.mp4 reframer:rt=on c=avc:b=1m -o dash/test.mpd:segdur=2 -rmt
```

# 1. Get the session on screen {:data-level="all"}

Reload the page with the reload button at the left of the connection selector. You should now see the whole session.

<figure markdown="span">
  ![The monitoring interface connected to the running session](images/all_session.png)
</figure>

# 2. Compare the graph with your command {:data-level="all"}

The **Pipeline Graph** shows more filters than your command names: the extra ones were created implicitly by GPAC to resolve the graph.

Each edge is a connection between two filters, and its color tells which kind of stream it carries: green for audio, blue for video, yellow for text, red for files. At a glance, you see which stream travels through each connection: 

<figure markdown="span">
  ![Edges colored by stream type in the Pipeline Graph](images/edges_nodes.png)
</figure>

# 3. Open the encoder {:data-level="all"}

Click the encoder node in the graph. The filter opens in its own tab of the **Session Filters** widget, on its Overview tab, next to the Dashboard that lists every filter of the session.

<figure markdown="span">
  ![The encoder opened from the graph](images/encoder_overview.png)
</figure>

Switch between the four tabs of the filter. Overview summarizes what the filter reports: its status, packets and data. Stats shows the bytes it receives and sends per second, with a chart over a time window you choose. Inputs and Outputs list the PIDs entering and leaving the filter, their number shown in the tab name.

The Status chart plots the values the encoder reports, such as **Fps**, **Frames**, **Q** (quality of the last frame, lower is better) and **LAT** (internal latency: the number of frames the encoder holds, received but not yet output). Click a name in the legend to hide its curve, or to show it again: to follow only **Fps**, click the others. Hover the info icon next to a name to read what it measures.

Below the chart, the P badge shows the type of the last encoded frame (I, P or B). The Packets card counts the packets the encoder received (Done) and output (Sent): their difference is the **LAT** value. The Data card shows the compression at work: the encoder receives raw frames and outputs far fewer bytes.

# 4. Inspect the PIDs of a filter {:data-level="all"}

Each edge of the graph carries a stream, a PID. Click an edge that enters a muxer: the muxer opens directly on its Inputs tab, with one line per incoming PID and its statistics: buffer, average bitrate, processing rate, last processing time.

<figure markdown="span">
  ![Statistics and bitrate chart of the audio PID entering a muxer](images/pid_metrics.png)
</figure>

The chart below the table plots one statistic for the selected PIDs. Click a column label, such as **AVG BITRATE**, to choose that statistic. Hover a value to see the related statistics of the same family, and click **+** next to one to plot it. Use the radio button at the left of a PID to add it to the chart or remove it.

## Read the properties of a PID

<figure markdown="span">
  ![All properties of the audio PID, opened with the eye icon](images/pid_properties.png)
</figure>

Then click the eye icon of the PID: all its properties open at once, with a search field to find one quickly. Look for the ones you already know about your input file, such as its timescale.

The Outputs tab lists the PIDs the filter produces, with the same statistics. Comparing the two tabs of one filter tells you whether data enters it, and whether it leaves it. To see the properties of an output PID, click the edge that leaves the filter and open its eye icon in the next filter's Inputs tab.

# 5. Check what GPAC reports {:data-level="all"}

Look at the Logs counters in the header: errors, warnings and info messages currently held by the monitor. Click a counter to display the corresponding messages in the **System Logs** widget.

<figure markdown="span">
  ![Error and warning counters in the header](images/log_counters.png)
</figure>

To see more about one part of GPAC, open the gear icon of **System Logs**: every GPAC log tool is listed with its level. Raise only the tool you are investigating, for example **Media** to **Info**, and leave the others at **Warning**. The header then shows the active configuration, here `all@warning:media@info`.

<figure markdown="span">
  ![Raising the level of one log tool](images/log_config.png)
</figure>

# 6. Check resource usage {:data-level="all"}

**System Metrics** shows CPU, memory and the number of cores of the machine. Use it to watch trends while the session runs, for example how the CPU reacts when you change the encoding options of the same command.

!!! note

    On Linux, the CPU value reflects the load of the whole machine, not of the GPAC process only. The memory value is the peak used by the process since it started, so the curve never goes down, even when memory is released.

# 7. Keep your workspace {:data-level="all"}

Move, resize, close or reopen the widgets until the layout suits the investigation, then save it from **Layouts** to restore it the next time you monitor the same kind of pipeline.

<figure markdown="span">
  ![Saving and restoring a layout](images/layout.png)
</figure>

# 8. Replay the session {:data-level="all"}

To inspect a session after it ends, record it with `-rmt-log` as described in [Session recording](remote-monitoring#session-recording). Click **History** in the header: the replay opens in a separate window, where some header controls are not available.

The **Select a session** window lists, under **From GPAC**, the recordings of the GPAC instance you are connected to; the recording in progress is marked. Without a running GPAC, drag the folder given to `-rmt-log` onto **Drop a history folder**.

<figure markdown="span">
  ![The replay timeline: event journal, seek bar with a zoom rectangle, event rows and session time](images/timeline.png)
</figure>

The widgets show the session as it was at the cursor time. The timeline at the bottom of the window lets you move that cursor.

While replaying, use the same interface as in live: open a filter from the graph, read the statistics and properties of its PIDs, follow its logs. Only the video preview is not available.

## Play and move in time

Click the play button to replay the session from the cursor, and click it again to pause. Click or drag the seek bar to jump to another time: the time under the pointer is shown above the bar.

**Session time** shows the cursor time and the total duration of the recording. To reach an exact time, type it in the field below, for example `1d 02:00:00` or `26:00:00`.

<figure markdown="span">
  ![Session time, the go-to-time field and the zoom buttons](images/timeline_session_time.png)
</figure>

## Zoom on a period

Click the time ruler under the seek bar: a red rectangle appears. Drag its edges to choose the period, or drag it to move it, then click **+** next to **Zoom** to show only that period. Click **−** to zoom out.

<figure markdown="span">
  ![The seek bar and the time ruler, with the red zoom rectangle](images/timeline_ruler.png)
</figure>

Drag the ruler to scroll through the session while zoomed. Click inside the rectangle to hide it.

## Find an event

Under the ruler, the **Errors**, **Graph** and **Config** rows place the events of the session in time: errors and warnings, graph changes, PID reconfigurations and filter argument changes. Click a dot to move the cursor to that event. A larger grey dot groups close events: zoom in to separate them.

<figure markdown="span">
  ![Events placed in time on the Errors, Graph and Config rows](images/timeline_events.png)
</figure>

The **Event Journal** on the left lists the events of the visible period. Click the time of an event to move the cursor there; hover it to read its absolute time.

<figure markdown="span">
  ![The event filter and the Event Journal](images/timeline_journal.png)
</figure>

Use **Events:** to show one kind of event only, in the rows and in the journal: **Errors**, **Graph**, **PIDs** or **Args**. **All** shows them all again.
