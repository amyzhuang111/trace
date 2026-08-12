import { sequentialBlue, chartInk } from "@/lib/chartColors";

function colorForCount(count: number, max: number): string {
  if (count === 0) return "transparent";
  const steps = sequentialBlue;
  const idx = Math.min(steps.length - 1, Math.round((count / Math.max(1, max)) * (steps.length - 1)));
  return steps[idx];
}

function textColorFor(count: number, max: number): string {
  if (count === 0) return chartInk.muted;
  const ratio = count / Math.max(1, max);
  return ratio > 0.55 ? "#ffffff" : chartInk.primary;
}

export function CoverageHeatmap({
  rowLabels,
  colLabels,
  matrix,
  rowHeading,
  colHeading,
}: {
  rowLabels: readonly string[];
  colLabels: readonly string[];
  matrix: number[][];
  rowHeading: string;
  colHeading: string;
}) {
  const max = Math.max(1, ...matrix.flat());
  const weakCells = matrix.flat().filter((v) => v === 0).length;

  return (
    <div>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="border-separate" style={{ borderSpacing: 3 }}>
          <thead>
            <tr>
              <th className="w-32 text-left text-[10.5px] font-medium text-muted-2 pb-1">{rowHeading} \ {colHeading}</th>
              {colLabels.map((c) => (
                <th key={c} className="px-1 pb-1 text-[10.5px] font-medium text-muted whitespace-nowrap text-center">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowLabels.map((r, ri) => (
              <tr key={r}>
                <td className="pr-2 text-[11.5px] text-foreground whitespace-nowrap">{r}</td>
                {colLabels.map((c, ci) => {
                  const count = matrix[ri][ci];
                  return (
                    <td key={c} className="p-0">
                      <div
                        title={`${r} × ${c}: ${count} case${count === 1 ? "" : "s"}`}
                        className="flex h-8 w-12 items-center justify-center rounded text-[11.5px] font-semibold border"
                        style={{
                          background: colorForCount(count, max),
                          color: textColorFor(count, max),
                          borderColor: count === 0 ? chartInk.grid : "transparent",
                        }}
                      >
                        {count || ""}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {weakCells > 0 && (
        <p className="mt-2 text-[11.5px] text-muted-2">
          {weakCells} of {rowLabels.length * colLabels.length} combinations have zero coverage.
        </p>
      )}
    </div>
  );
}
