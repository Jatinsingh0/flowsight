interface PlanBreakdownProps {
  plans: {
    plan: string;
    count: number;
  }[];
}

export function PlanBreakdown({ plans }: PlanBreakdownProps) {
  if (plans.length === 0) {
    return (
      <div className="rounded-xl border border-borderSubtle bg-card/50 backdrop-blur-sm p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent2/5">
        <h3 className="text-base font-medium text-textBase">Plans overview</h3>
        <p className="mt-2 text-sm text-textMuted">No subscription data yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-borderSubtle bg-card/50 backdrop-blur-sm p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent2/5">
      <h3 className="text-base font-medium text-textBase">Plans overview</h3>
      <p className="text-sm text-textMuted">
        Distribution of customers by plan
      </p>
      <div className="mt-4 space-y-3">
        {plans.map((plan) => (
          <div
            key={plan.plan}
            className="flex items-center justify-between rounded-lg border border-borderSubtle/50 bg-card/40 px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium text-textBase">{plan.plan}</p>
              <p className="text-xs text-textMuted">Plan</p>
            </div>
            <span className="text-lg font-semibold text-textBase">
              {plan.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


