# country-scores-calculator

Fetches top 10 Swedish scores on each map on two sets of maps and calculates total score. Map pools are the two tryout map sets we use, one for speed/midspeed/tech maps and one for acc.

Scrapes scoresaber leaderboards, up to 10 pages only per map, or until it reaches 10 Swedish plays.

Can be easily modified for other map sets, other countries or how to calculate final score.

I wrote this as a way to automate and get an overview over the scores specifically for the Swedish tryouts for BSWC, so a lot of stuff is hardcoded.

# How to run

Requires [NodeJS](https://nodejs.org/en/), I ran it with 14.16.1 LTS but other versions probably work.

1. Download/clone repository files
2. run `npm install`
3. Run script with `node leaderboardFetch.js`. 

It will take a few minutes, since it waits a few seconds between each call to scoresaber.

To build .exe file use `pkg package.json` (might need to install pkg first though)
