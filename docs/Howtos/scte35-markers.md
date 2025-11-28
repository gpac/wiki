---
tags:
- mpd
- pid
- data
- filter
- packet
- remux
- stream
- xml
- dump
- block
- media
- segment
- isobmff
- track
- chunk
- mp4
- source
- input
- isomedia
- output
- sink
- dash
---

# Overview {:data-level="all"}

GPAC gained (starting in version 2.4.0) the ability to deal with dynamic metadata such as SCTE-35. The information in this page also applies to other metadata such as ID3 markers (e.g. Nielsen), timecodes (TEMI, QT), or virtually any type of dynamic metadata.

GPAC is able to:
- inspect,
- edit to some extent via [NHML](NHML-Format),
- insert dynamically via the C/JS/Python/... API,
- remux or transmux between MPEG-TS and ISOBMFF-based formats (MP4, MPEG-DASH, HLS, CMAF),
- create 23001-18 Event Tracks and DASH content,
- align IDRs with events in case of transcoding.

A special [dec_scte35 filter](scte35dec) was created to segment SCTE-35 content or insert cue start property on splice points to align transcoded GOPs with SCTE-35 events. The [dec_scte35 filter](scte35dec) needs to be explicitely added to the graph (or requested from the [dasher](dasher) with the `evte_agg` option).

# Inspection {:data-level="all"}

The content can be inspect like any other content in GPAC. Packet-based inspection may allow to dump useful information for analysis and reprocessing.

## GPAC inspect

```
gpac -i input inspect:analyze=full:deep:props
```

would output:

```
[...]
<Packet number="970" PID="1" framing="complete" dts="1636452" cts="1640956" dur="1502" sap="0" ilace="0" corr="0" seek="0" bo="N/A" roll="0" crypt="0" vers="0" size="6799" lp="0" depo="0" depf="0" red="0" CRC32="0x17CDFEAC">
 <SCTE35>
  <scte35:SpliceInfoSection xmlns:scte35="urn:scte:scte35:2013:bin" sap_type="3" protocol_version="0" encrypted_packet="0" pts_adjustment="183000" tier="4095">
   <scte35:SpliceInsert splice_event_id="4026531841" splice_event_cancel_indicator="False" out_of_network_indicator="True" program_splice_flag="True" duration_flag="False" splice_immediate_flag="False">
    <scte35:SpliceTime pts_time="1813812"/>
   </scte35:SpliceInsert>
  </scte35:SpliceInfoSection>
 </SCTE35>
</Packet>
[...]
```

## MP4Box -dxml

```
MP4Box -dxml scte35.mp4
```

scte35_dump.xml would contain for instance such descriptions for a sample:

```
[...]
<NHNTSample number="94" DTS="41224943904144" dataLength="98" CTSOffset="0" isRAP="yes" mediaOffset="0" sourceByteOffset="13584" duration="48048" depends="24" >
<EventMessageInstanceBox Size="98" Type="emib" Version="0" Flags="0" Specification="EventMessageTrack" Container="file" presentation_time_delta="122121" event_duration="239239" event_id="1" scheme_id_uri="urn:scte:scte35:2013:bin" value="" message_data="0xFC302500000000697800FFF01405F00000027FEFFE1D0AC9C1FE000DB07B0001010100001231F90A" >
  <scte35:SpliceInfoSection xmlns:scte35="urn:scte:scte35:2013:bin" sap_type="3" protocol_version="0" encrypted_packet="0" pts_adjustment="27000" tier="4095">
   <scte35:SpliceInsert splice_event_id="4026531842" splice_event_cancel_indicator="False" out_of_network_indicator="True" program_splice_flag="True" duration_flag="True" splice_immediate_flag="False">
    <scte35:SpliceTime pts_time="487246273"/>
    <scte35:BreakDuration duration="897147"/>
   </scte35:SpliceInsert>
  </scte35:SpliceInfoSection>
</EventMessageInstanceBox>
</NHNTSample>
[...]
```

# Edit metadata

It is possible to edit data using the [NHML](NHML-Format) serialization format.

For example some inspected content can be re-injected, see [this example from the testsuite](https://github.com/gpac/testsuite/blob/master/scripts/scte35.sh):

```
<?xml version="1.0" encoding="UTF-8" ?>
<NHNTStream version="1.0" timeScale="90000" mediaType="meta" mediaSubType="sc35" mime_type="text/plain" text_encoding="utf-8">

 <NHNTSample DTS="100000" isRAP="yes">
  <EventMessageInstanceBox Version="0" Flags="0" presentation_time_delta="165000" event_duration="135000" event_id="0" scheme_id_uri="urn:scte:scte35:2013:bin" value="">
  <SpliceInfoSection xmlns="http://www.scte.org/schemas/35" sapType="3" protocolVersion="0" ptsAdjustment="0" tier="4095">
   <TimeSignal>
    <SpliceTime ptsTime="329696250"/>
   </TimeSignal>
   <SegmentationDescriptor segmentationEventId="3658" segmentationEventCancelIndicator="0" segmentationEventIdComplianceIndicator="1" programSegmentationFlag="1" segmentationDurationFlag="1" deliveryNotRestrictedFlag="1" segmentationDuration="135000" segmentationTypeId="52" segmentNum="0" segmentsExpected="0" subSegmentNum="0" subSegmentsExpected="0">
   </SegmentationDescriptor>
  </SpliceInfoSection>
  </EventMessageInstanceBox>
 </NHNTSample>

</NHNTStream>
```



# Remux and transmux {:data-level="all"}

GPAC is able to remux any to any, including but not limited to:
- TS to TS
- MP4 (23001-18) to MP4 (23001-18)
- TS to MP4 (23001-18)
- NHML to TS or MP4

See specific instructions in the next section when segmenting for OTT packaging (MPEG-DASH, HLS).

The command-line is trivial:

```
gpac -i input -o output
```

The format is selected automatically depending on the file extension (or can be forced with ```:ext=```).

# Segmentation and 23001-18 ISOBMFF Event Track {:data-level="all"}

Adaptive streaming with DASH or HLS requires the content to be segmented. Simple segmentation (where content can be replicated over several segments without any change) works for all kind of streams.

For SCTE-35 streams the dec_scte35 [filter](scte35dec) must be either explicitly loaded or the [dasher](dasher) `evte_agg` option must be set.
Note that it can detect the segment duration from the [dasher](dasher) to create the right segmentation for you:

```
gpac -i input scte35dec -o output.mpd:segdur=2:evte_agg
```

Whenever possible the content is in the form of 23001-18 ISOBMFF Event Tracks. `emib` and `emeb` boxes are inserted automatically.

# Align IDRs with events in case of transcoding {:data-level="all"}

The following example will transcode a MPEG-TS file while inserting IDRs atSCTE-35 cue points and copying all the other data: 

```
gpac -i video.ts scte35dec:mode=passthrough c=avc -o output.ts
```
