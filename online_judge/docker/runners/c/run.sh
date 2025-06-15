#!/bin/bash
gcc /app/Main.c -o /app/a.out && timeout 5 /app/a.out
