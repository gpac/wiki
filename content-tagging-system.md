

# GPAC Wiki Content Tagging and Level Switch System

## Overview

The GPAC wiki implements a content tagging and level switch system to provide a customized reading experience for users with different levels of expertise. This system allows users to toggle between "Beginner" and "Expert" modes, affecting the visibility of content sections and keywords displayed.

## Purpose

The main goals of this system are:
1. To help users new to GPAC access simpler, more approachable content.
2. To provide more in-depth, technical content for experienced users.
3. To create a dynamic reading experience that adapts to the user's knowledge level.

## Implementation

### Content Tagging

Content tagging is implemented in Markdown files using the `attr_list` extension. Tags are applied to H1 headers (single `#` in Markdown) using the following syntax:

```markdown
# Section Title {: data-level="beginner" }
```

Available levels:
- `beginner`: Content suitable for newcomers to GPAC.
- `expert`: More advanced content (default if not specified).
- `all`: Content that appears in both beginner and expert modes.

### Level Switch

The level switch is a toggle located in the top-left corner of the user interface. It allows users to switch between "Beginner" and "Expert" modes.

Default setting: The default level is set to "Expert", displaying all documentation.

User preference storage: The selected level is stored in the browser's local storage, persisting between sessions.

## Functionality

### Content Visibility

When switching between levels:

1. Expert mode:
   - All sections are visible.
   - The full Table of Contents (TOC) is displayed, including all sections and subsections.

2. Beginner mode:
   - Only sections tagged as "beginner" or "all" are visible.
   - Sections not explicitly tagged may disappear.
   - The TOC displays only visible sections without subsections.

### Keywords Cloud

The keywords cloud is dynamic and changes based on the selected level:

- In Expert mode: All keywords are displayed.
- In Beginner mode: Only keywords tagged as "beginner" or "all" are shown.

Keywords are defined in the `data/keywords.json` file with the following structure:

```json
{
  "KEYWORD": {
    "description": "Keyword description",
    "level": "beginner"
  }
}
```

When a user clicks on a keyword, a modal appears with the keyword's definition.

## Implementation Details

### Key Files

- `javascripts/levels.js`: Main logic for level switching and content filtering.
- `javascripts/domManipulation.js`: Handles DOM manipulation for showing/hiding content.

### Howtos Section

The level switching functionality is currently implemented only in the "Howtos" section of the documentation.


## Developer Guidelines

1. Tagging new content:
   - Always tag H1 headers in Markdown files.
   - Use the format: `# Title {: data-level="level" }` where `level` is "beginner", "expert", or "all".
   - The "all" sections are visible to beginners and experts.
        Any section tagged with "all" will have its collapse menu unfolded.
        They are often used for "Overview" sections.
   - Untagged sections are considered "expert" by default.

2. Adding new keywords:
   - Add new keywords to the `data/keywords.json` file.
   - Include a description and appropriate level tag.

3. Testing:
   - Test new content in both Beginner and Expert modes to ensure proper visibility.
   - Verify that the TOC updates correctly when switching levels.
   - Check that the keywords cloud updates appropriately.

## Known Limitations

1. The level switching feature is currently only available in the "Howtos" section.
2. The visibility of untagged sections in Beginner mode may not be consistent across all pages.

## Future Enhancements

1. Implement direct linking to keyword pages (e.g., `/glossary/${keyword}`).
2. Extend the level switching functionality to other sections of the documentation.
3. Improve the visibility and user experience of the level switch toggle.
