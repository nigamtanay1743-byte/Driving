const transitions = {
  pending: ['confirmed', 'rejected', 'cancelled'],
  confirmed: ['cancelled', 'completed'],
  rejected: [],
  cancelled: [],
  completed: [],
};

export function canTransition(from, to) {
  return transitions[from]?.includes(to) ?? false;
}
