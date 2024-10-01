---
hide:
  - toc
---

`encrypt` is a function that allows you to encrypt multimedia files using specified encryption keys.

```bash
encrypt(input_file, output_file, key_file)
```

## Reference
```bash
encrypt("input.mp4", "output.mp4", "keyfile.xml")
```

## Usage

- Encrypting video files
- Encrypting audio files
- Encrypting live multimedia streams
- Managing encryption keys

## Troubleshooting

### My output file is corrupted after encryption
- Verify that the key file is correct and compatible with the input multimedia file.

### Permission error when accessing the key file
- Ensure you have the necessary permissions to read the key file.
## Example

```bash
encrypt("input.mp4", "output.mp4", "keyfile.xml")
```

## Parameters

- **input_file**: Path to the multimedia file to be encrypted.
- **output_file**: Path where the encrypted file will be saved.
- **key_file**: Path to the key file used for encryption.

## See Also
- [Decoder](decoder)
