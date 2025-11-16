# Veterinary Documents Upload Directory

This directory is used for batch uploading veterinary guideline documents to the File Search store.

## Supported File Types

- **PDF** (`.pdf`) - Preferred for guideline documents
- **DOCX** (`.docx`) - Microsoft Word documents
- **TXT** (`.txt`) - Plain text files
- **JSON** (`.json`) - Structured data
- **Markdown** (`.md`) - Markdown formatted documents

## File Naming Conventions

For automatic categorization, include keywords in your filenames:

- **Canine (Dogs)**: Include `canine` or `dog` in the filename
  - Example: `AAHA_canine_vaccination_guidelines_2024.pdf`
  - Example: `dog-vaccination-protocol.pdf`

- **Feline (Cats)**: Include `feline` or `cat` in the filename
  - Example: `AAFP_feline_vaccination_guidelines.pdf`
  - Example: `cat-rabies-protocol.docx`

## Usage

1. **Place documents in this directory**
   ```bash
   cp your-guidelines.pdf vet-documents/
   ```

2. **Run the upload script**
   ```bash
   pnpm upload:vet-docs
   ```

3. **Monitor the upload progress**
   - The script will show upload progress for each file
   - Successfully uploaded documents will be marked with ✅
   - Failed uploads will be marked with ❌

## Recommended Sources

### Canine Vaccination Guidelines
- AAHA (American Animal Hospital Association)
- WSAVA (World Small Animal Veterinary Association)
- AVMA (American Veterinary Medical Association)

### Feline Vaccination Guidelines
- AAFP (American Association of Feline Practitioners)
- WSAVA (World Small Animal Veterinary Association)
- AVMA (American Veterinary Medical Association)

## File Size Limits

- Maximum file size: **100 MB** per file
- Recommended: Keep files under 10 MB for faster processing

## Metadata

The upload script automatically adds metadata to each document:

- `category`: "veterinary-vaccination"
- `type`: "canine" or "feline" (based on filename)
- `uploadedVia`: "batch-script"

## Troubleshooting

### "No File Search store found"
Run `pnpm init:stores` to initialize File Search stores for all agents.

### "Permission denied"
Make sure you have the admin user ID configured in the upload script.

### "Upload failed"
Check the file format and size. Ensure the file is not corrupted.

## Security

⚠️ **Important**: This directory is excluded from version control (`.gitignore`).
Never commit actual veterinary guideline documents to the repository.

## After Upload

Once documents are uploaded, you can:
1. Navigate to the chat interface
2. Select the Research Assistant (or Veterinary Assistant) agent
3. Ask questions about vaccination protocols
4. The AI will use the uploaded documents to provide evidence-based answers with citations
