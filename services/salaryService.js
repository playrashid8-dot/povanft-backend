function checkSalary(user) {
  const levels = [
    { d: 5, t: 8, v: 1000, s: 100, r: 20 },
    { d: 8, t: 15, v: 3000, s: 200, r: 50 },
    { d: 15, t: 40, v: 8000, s: 300, r: 120 },
    { d: 25, t: 100, v: 20000, s: 500, r: 300 },
    { d: 45, t: 300, v: 30000, s: 1000, r: 700 }
  ];

  const stage = user.salaryStageClaimed;

  const next = levels[stage];
  if (!next) return;

  const freshDirect = user.directCount - user.snapshot.directs;
  const freshTeam = user.teamCount - user.snapshot.team;
  const freshVolume = user.teamVolume - user.snapshot.volume;

  if (
    freshDirect >= next.d &&
    freshTeam >= next.t &&
    freshVolume >= next.v &&
    user.activeStake >= next.s
  ) {
    user.balance += next.r;

    user.salaryStageClaimed += 1;

    user.snapshot.directs = user.directCount;
    user.snapshot.team = user.teamCount;
    user.snapshot.volume = user.teamVolume;
  }
}

module.exports = { checkSalary };