# Working with Timecodes

Timecodes are metadata embedded within media streams that represent a specific time point, often used in production and post-production workflows. This document explains how to manipulate, inspect, and split media based on timecodes using GPAC filters.

## Supported Codecs

Timecode manipulation and inspection described here are supported for **AV1**, **HEVC**, and **AVC** video streams.

## Timecode Manipulation ([`bsrw`](bsrw) filter)

The [`bsrw`](bsrw) (BitStream ReWriter) filter allows for powerful manipulation of timecodes embedded in the bitstream.

**Basic Usage:**

```bash
gpac -i input.mp4 bsrw:tc=<mode>[:options] output.mp4
```

**Options:**

- `tcxs=TC<HH:MM:SS:FF>`: Defines the start timecode for the manipulation. Processing starts from the first packet whose timecode is greater than or equal to `tcxs`. By default, manipulation applies to all packets from the beginning.
- `tcxe=TC<HH:MM:SS:FF>`: Defines the end timecode for the manipulation. Processing stops after the packet whose timecode is greater than `tcxe`. By default, manipulation applies to all packets until the end.
- `tcsc=TC<HH:MM:SS:FF> | first`: Specifies the timecode source/value used by certain modes.
  - The format `TC<HH:MM:SS:FF>` (Hours:Minutes:Seconds:Frames) is used.
  - Negative values are only meaningful in `shift` mode.
  - Setting `tcsc=first` infers the value from the first encountered timecode within the `tcxs`/`tcxe` range. If no timecode is found when `tcsc=first` is set, the filter performs no operation. This option is required by `shift` and `constant` modes. For `insert` mode, it provides an optional starting offset.
- `tcdf`: Enables NTSC drop-frame timecode counting. When enabled, timecode calculations account for the NTSC drop-frame standard.

**Modes (`tc=<mode>`):**

1.  **`remove`**:

    - Removes all existing timecodes from the bitstream within the specified range (`tcxs`/`tcxe`).
    - Example: `gpac -i in.mp4 bsrw:tc=remove out.mp4`

2.  **`insert`**:

    - Inserts timecodes based on the frame's Composition Time Stamp (CTS).
    - Overwrites any existing timecodes.
    - Optionally uses `tcsc` as a starting offset. If `tcsc` is set to a specific timecode (e.g., `TC00:00:10:00`), this value acts as an offset added to the CTS-derived timecode. If `tcsc=first`, the timecode of the first frame (within `tcxs`/`tcxe`) is used as the base, and subsequent frames increment from there. If `tcsc` is not provided, the effective offset is typically zero.
    - Example (Insert with offset): `gpac -i in.mp4 bsrw:tc=insert:tcsc=TC00:00:10:00 out.mp4`
    - Example (Infer start from first timecode): `gpac -i in.mp4 bsrw:tc=insert:tcsc=first out.mp4`

3.  **`shift`**:

    - Shifts existing timecodes by the value defined in `tcsc`.
    - Requires `tcsc`. The value can be positive or negative.
    - Only modifies existing timecodes; it does not insert new ones if they are missing.
    - Example (Shift all timecodes forward by 10 seconds): `gpac -i in.mp4 bsrw:tc=shift:tcsc=TC00:00:10:00 out.mp4`
    - Example (Shift timecodes backward by 5 frames, starting from 1 minute): `gpac -i in.mp4 bsrw:tc=shift:tcsc=-TC00:00:00:05:tcxs=TC00:01:00:00 out.mp4`

4.  **`constant`**:
    - Sets all existing timecodes to the constant value defined in `tcsc`.
    - Requires `tcsc`.
    - Only modifies existing timecodes; it does not insert new ones.
    - Example (Set all timecodes to 1 hour): `gpac -i in.mp4 bsrw:tc=constant:tcsc=TC01:00:00:00 out.mp4`

## Timecode Inspection ([`inspect`](inspect) filter)

The [`inspect`](inspect) filter can be used to view the timecodes present in a stream.

**Methods:**

1.  **Deep Analysis (`deep:analyze=on`)**:

    - Provides detailed information about the bitstream structure, including SEI messages containing timecodes.
    - Command: `gpac -i input.mp4 inspect:deep:analyze=on`
    - Example Output Snippet (HEVC/AVC):
      ```xml
      <NALU size="10" code="6" type="SEI Message">
        <SEIMessage ptype="1" psize="6" type="pic_timing" pic_struct_0="0" num_clock_ts="1" clock_timestamp_flag_0="1" nuit_field_based_flag_0="0" counting_type_0="0" full_timestamp_flag_0="1" discontinuity_flag_0="0" cnt_dropped_flag_0="0" time_code_0="00:00:07:07"/>
      </NALU>
      ```

2.  **Formatted Output (`fmt`)**:
    - Allows extracting specific properties, including the timecode (`$tmcd$`). `$lf$` represents a line feed.
    - Command: `gpac -i input.mp4 inspect:fmt="$tmcd$$lf$"`
    - Example Output:
      ```
      tmcd
      00:00:04:00
      00:00:04:01
      00:00:04:02
      00:00:04:03
      00:00:04:04
      ...
      ```
      _(Note: The exact format might vary slightly, e.g., using ';' or ':' as frame separators depending on whether the timecode uses drop-frame counting)._

## Timecode Splitting ([`reframer`](reframer) filter)

The [`reframer`](reframer) filter can split or cut media based on timecode values using the `xs` (start) and `xe` (end) options.

**Options:**

- `xs=TC<HH:MM:SS:FF>`: Starts the output stream from the first frame whose timecode is greater than or equal to the specified value.
- `xe=TC<HH:MM:SS:FF>`: Ends the output stream after the frame whose timecode is greater than the specified value.
- `xots`: (Use Original Timestamps for Start) When used with `xs`, this option adjusts the output Composition Time Stamps (CTS) so that the first output frame's CTS corresponds to the time specified by `xs`, relative to the _original_ stream's timing.

**Behavior:**

- **Without `xots`**: When using `xs`, the output stream's timestamps (CTS) are rewritten starting from 0.

  - Example (Start output from timecode 00:00:04:00, timestamps restart from 0):
    ```bash
    gpac -i input.mp4 reframer:xs=TC00:00:04:00 output.mp4
    ```

- **With `xots`**: When `xs` and `xots` are used together, the output CTS values are offset. The first frame's CTS will reflect its position in the original timeline, calculated based on the `xs` timecode value and the stream's timescale.
  - Example: If the input stream's first timecode is `00:00:00:10` (and assuming a timescale where 1 frame = 1 time unit, for simplicity), and you use `xs=TC00:00:00:08` with `xots`, the first output frame (which originally had timecode `00:00:00:10`) will have its CTS adjusted. If the frame corresponding to `TC00:00:00:08` would have had CTS `X`, the frame `TC00:00:00:10` will get CTS `X + 2`. If `TC00:00:00:08` was the _very first_ possible timecode (hypothetically CTS=0), then the frame `TC00:00:00:10` would start at CTS `2`.
  - Command:
    ```bash
    gpac -i input.mp4 reframer:xs=TC00:00:00:08:xots output.mp4
    ```

For more detailed information on the [`reframer`](reframer) filter's capabilities, please refer to its dedicated documentation page.
