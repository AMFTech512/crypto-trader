#!/bin/bash
node dist &> output.log &
echo "Executing crypto-trader daemon with pid $!..."