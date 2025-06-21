# osu! Tapping Benchmark
### Description
Introducing my version of a web-based tapping benchmark application for the rhythm game called "osu!".

### Features
1. Run tapping benchmark for user's choice of time or number of taps.
2. Shows taps, BPM (beats per minute), UR (unstable rate) and CPS (clicks per second) in real-time.
3. Allows editing of tapping and reset keys.
4. Shows a real-time progress bar for user's set goal.
### Calculation Methods
#### BPM (beats per minute)
$$
\text{BPM} = \left( \frac{\text{clicks}}{\text{time elapsed in minutes}} \right) \times \frac{1}{4}
$$

- The result is multiplied by 1/4 to match the quarter-beat spacing commonly used for streams in osu!.

#### CPS (clicks per second)
$$
\text{CPS} = \frac{\text{clicks}}{\text{time elapsed in seconds}}
$$

#### UR (unstable rate)
$$
\text{UR} = \text{stdev(intervals) * 10}
$$

- This is a method to calculate consistency between taps.
- "intervals" represents a dataset of time interval in milliseconds between successive taps.

### Features to be added (so far)
1. Enable mouse clicks for tapping.
2. Different themes.
3. Show final statistics as an image or a pdf.
