#!/bin/bash

# Video optimization script for portfolio
# Reduces file sizes while maintaining good quality for web display

set -e

VIDEO_DIR="public/media/projects/videos"
BACKUP_DIR="${VIDEO_DIR}/originals"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting video optimization...${NC}\n"

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg is not installed. Please install it first:"
    echo "  Ubuntu/Debian: sudo apt-get install ffmpeg"
    echo "  macOS: brew install ffmpeg"
    exit 1
fi

# Process videos in the correct directory
cd "$(dirname "$0")"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to optimize WebM video
optimize_webm() {
    local input=$1
    local output=$2
    local max_width=${3:-1280}  # Default max width 1280px

    echo -e "${YELLOW}Optimizing WebM: $(basename "$input")${NC}"

    # Get video dimensions
    width=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$input")

    # Calculate scale if needed
    if [ "$width" -gt "$max_width" ]; then
        scale_filter="scale=$max_width:-2"
    else
        scale_filter="scale=-2:-2"
    fi

    ffmpeg -i "$input" \
        -c:v libvpx-vp9 \
        -b:v 500k \
        -maxrate 750k \
        -bufsize 1000k \
        -vf "$scale_filter" \
        -row-mt 1 \
        -cpu-used 2 \
        -an \
        -pass 1 \
        -f webm \
        -y /dev/null

    ffmpeg -i "$input" \
        -c:v libvpx-vp9 \
        -b:v 500k \
        -maxrate 750k \
        -bufsize 1000k \
        -vf "$scale_filter" \
        -row-mt 1 \
        -cpu-used 1 \
        -an \
        -pass 2 \
        -y "$output"

    # Clean up pass files
    rm -f ffmpeg2pass-0.log
}

# Function to optimize MP4 video
optimize_mp4() {
    local input=$1
    local output=$2
    local max_width=${3:-1280}

    echo -e "${YELLOW}Optimizing MP4: $(basename "$input")${NC}"

    # Get video dimensions
    width=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$input")

    # Calculate scale if needed
    if [ "$width" -gt "$max_width" ]; then
        scale_filter="scale=$max_width:-2"
    else
        scale_filter="scale=-2:-2"
    fi

    ffmpeg -i "$input" \
        -c:v libx264 \
        -preset slow \
        -crf 28 \
        -vf "$scale_filter" \
        -movflags +faststart \
        -an \
        -y "$output"
}

# Function to get file size in KB
get_size() {
    du -k "$1" | cut -f1
}

# Process each video (already have absolute path)

# Define videos to optimize with their target widths
declare -A videos=(
    ["wooster.webm"]=800
    ["wooster-preview.webm"]=800
    ["wooster.mp4"]=800
    ["wooster-preview.mp4"]=800
    ["goss3.webm"]=800
    ["goss3.mp4"]=800
    ["goss-preview.webm"]=800
    ["goss-preview.mp4"]=800
    ["foundations.webm"]=800
    ["foundations.mp4"]=800
    ["aigument.webm"]=800
    ["aigument-preview.webm"]=800
)

total_saved=0

for video in "${!videos[@]}"; do
    video_path="$VIDEO_DIR/$video"
    if [ -f "$video_path" ]; then
        target_width=${videos[$video]}

        # Get original size
        original_size=$(get_size "$video_path")

        # Backup original if not already backed up
        if [ ! -f "$BACKUP_DIR/$video" ]; then
            echo -e "${GREEN}Backing up: $video${NC}"
            cp "$video_path" "$BACKUP_DIR/"
        fi

        # Create temp file for optimized version with proper extension
        extension="${video##*.}"
        temp_file="${video_path%.*}.optimized.${extension}"

        # Optimize based on extension
        if [[ $video == *.webm ]]; then
            optimize_webm "$video_path" "$temp_file" "$target_width"
        elif [[ $video == *.mp4 ]]; then
            optimize_mp4 "$video_path" "$temp_file" "$target_width"
        fi

        # Get new size
        new_size=$(get_size "$temp_file")
        saved=$((original_size - new_size))
        total_saved=$((total_saved + saved))

        # Calculate percentage
        percent=$((100 - (new_size * 100 / original_size)))

        echo -e "${GREEN}✓ $video: ${original_size}KB → ${new_size}KB (saved ${saved}KB, -${percent}%)${NC}\n"

        # Replace original with optimized
        mv "$temp_file" "$video_path"
    fi
done

echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}Optimization complete!${NC}"
echo -e "${GREEN}Total space saved: ${total_saved}KB (~$((total_saved / 1024))MB)${NC}"
echo -e "${GREEN}Original files backed up to: $BACKUP_DIR${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
