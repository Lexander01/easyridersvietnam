#!/bin/bash
cd "$(dirname "$0")"
echo "Starting preview server..."
echo "Opening http://localhost:8000/tour-highlight-1.html"
sleep 1
open "http://localhost:8000/tour-highlight-1.html"
python3 -m http.server 8000
