#!/bin/bash
echo "FOOT PREDICT ANALYZER - Edition gratuite"
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000
