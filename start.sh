#!/bin/sh

command_exists () {
  type "$1" &> /dev/null ;
}

if command_exists pm2 ; then
  pm2 start npm --name "unboxer" -- start ;
fi
