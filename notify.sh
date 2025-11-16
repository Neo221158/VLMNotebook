#!/bin/bash
# Terminal Notification Script
# Plays cool sound patterns using terminal bell

# Colors for visual feedback
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to play bell with pattern
play_bell() {
    local count=$1
    local delay=$2
    for ((i=0; i<count; i++)); do
        printf '\a'
        [ $i -lt $((count-1)) ] && sleep "$delay"
    done
}

# Notification types
case "${1:-success}" in
    success|done|complete)
        echo -e "${GREEN}✨ Task Complete! ✨${NC}"
        # Triple ascending beep
        play_bell 1 0.1
        sleep 0.1
        play_bell 1 0.1
        sleep 0.1
        play_bell 1 0
        ;;

    error|fail|failed)
        echo -e "${RED}❌ Task Failed${NC}"
        # Double quick beep
        play_bell 2 0.05
        ;;

    warning|warn)
        echo -e "${YELLOW}⚠️  Warning${NC}"
        # Single long-ish pattern
        play_bell 1 0
        sleep 0.3
        play_bell 1 0
        ;;

    info|notify)
        echo -e "${BLUE}ℹ️  Notification${NC}"
        # Single beep
        play_bell 1 0
        ;;

    party|celebrate)
        echo -e "${GREEN}🎉 🎊 SUCCESS! 🎊 🎉${NC}"
        # Celebratory pattern - 5 beeps
        for i in {1..5}; do
            play_bell 1 0
            sleep 0.08
        done
        ;;

    *)
        echo "Usage: $0 [success|error|warning|info|party]"
        echo "Default: success"
        exit 1
        ;;
esac

# Add visual separator
echo -e "${NC}────────────────────────────────────────"
