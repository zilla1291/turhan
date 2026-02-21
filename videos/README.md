# Videos Folder - Auto Upload System

This folder contains all your portfolio videos that automatically display on the website.

## 📹 How to Add Videos

### Step 1: Add Video File
1. Place your `.mp4` video file in this folder
2. Use a clear filename (e.g., `cinematic-color-grading.mp4`)

### Step 2: Register Video in videos.json
1. Open `/data/videos.json`
2. Add a new entry following this format:

```json
{
    "id": 7,
    "title": "Your Video Title",
    "duration": "M:SS",
    "filename": "your-video-filename.mp4"
}
```

### Example Entry
```json
{
    "id": 7,
    "title": "Advanced Color Grading Techniques",
    "duration": "10:45",
    "filename": "advanced-color-grading.mp4"
}
```

## 📋 JSON Field Explanation

| Field | Description | Example |
|-------|-------------|---------|
| `id` | Unique number (auto-increments) | 1, 2, 3... |
| `title` | Video title displayed on card | "Cinematic Color Grading" |
| `duration` | Video length in M:SS format | "4:23", "12:45" |
| `filename` | Video file name in this folder | "cinematic-color-grading.mp4" |

## 🔄 Automatic Updates

Once you add the video entry to `videos.json`, the website will:
- ✅ Create a new video card automatically
- ✅ Display the video thumbnail with play button
- ✅ Show the duration badge
- ✅ Link to the video file in the `/videos/` folder
- ✅ Arrange cards based on ID numbers

## 📝 Video Naming Tips

- Use lowercase with hyphens: `my-awesome-video.mp4`
- Avoid spaces and special characters
- Keep filenames descriptive
- Use only `.mp4` format

## 🎬 Video Card Order

Videos display in the order of their `id` numbers in `videos.json`:
- ID 1 appears first (top-left)
- ID 2 appears second
- And so on...

## 🎥 Supported Formats

Currently supported: **MP4**

If you need other formats (WebM, MKV), convert to MP4 first using:
- Handbrake (free)
- FFmpeg (command line)
- Online converters

## 💡 Pro Tips

1. **Optimize video size** - Compress videos before uploading for faster loading
2. **Use consistent dimensions** - All videos should be widescreen (16:9)
3. **Add duration accurately** - Users check video length before clicking
4. **Keep filenames simple** - Makes management easier

## ❓ Troubleshooting

**Videos not showing?**
- Check filename spelling in `videos.json` matches the actual file
- Ensure video is in `.mp4` format
- Verify JSON syntax is correct (check brackets and commas)

**Player not working?**
- Try a different browser
- Check video file isn't corrupted
- Ensure sufficient disk space

## 📂 Folder Structure

```
turnhabey/
├── videos/                    (This folder)
│   ├── cinematic-color-grading.mp4
│   ├── text-animation-showcase.mp4
│   └── ... (your videos)
└── data/
    └── videos.json            (Update this file)
```

---

**Current Videos:** 6
**Add More Videos:** Follow steps above and refresh the website!
