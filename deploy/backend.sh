#!/bin/bash

read -p "Paste your MySQL installation path: " mySqlPath

mySqlPath=${mySqlPath#/} # Remove possible leading /
mySqlPath=${mySqlPath%/} # Remove possible trailing /

/$mySqlPath/bin/mysql -u root -p < ./nongame-db/deploy/create.sql

java -jar ./nongame-db/deploy/backend.jar