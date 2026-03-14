import QuizPlayer from "@/components/pages/QuizPlayer";

export default function QuizPlayPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { mode?: string; count?: string; time?: string; untimed?: string };
}) {
  const { id } = params;
  const { mode, count, time, untimed } = searchParams;
  return (
    <QuizPlayer
      id={id}
      mode={mode ?? "practice"}
      count={count}
      time={time}
      untimed={untimed === "true"}
    />
  );
}
