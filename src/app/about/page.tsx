import Link from "next/link";
import { ContentPageLayout } from "@/components/pages/ContentPageLayout";

export const metadata = {
  title: "About | Canadian Citizenship Test Prep",
  description:
    "Learn about this citizenship test reviewer — a small personal project built to help you prepare for your Canadian citizenship exam.",
};

export default function AboutPage() {
  return (
    <ContentPageLayout title="About This Project">
      <p>Hi, and welcome.</p>
      <p>
        This website started as a small personal project — something I built simply because I enjoy
        creating useful tools on the internet.
      </p>
      <p>
        I used to work as a <strong>full-stack developer</strong>, but like many people, my career
        path changed during the global disruption caused by the COVID-19 pandemic. Since then,
        I&apos;ve moved into a different field, but I still enjoy building websites and experimenting
        with ideas in my spare time. This citizenship test reviewer is one of those projects.
      </p>

      <h2>Why is it only CAD $9.99?</h2>
      <p>
        The short answer is: this project is more of a <strong>hobby than a business</strong>.
      </p>
      <p>The small fee helps cover the basic costs of keeping the site running, such as:</p>
      <ul>
        <li>VPS server hosting</li>
        <li>Domain name and infrastructure</li>
        <li>Ongoing maintenance and updates</li>
      </ul>
      <p>
        Anything left over mostly goes toward something a little more personal —{" "}
        <strong>food and veterinary care for my four cats</strong> who keep me company while I work
        on this project.
      </p>
      <p>
        My goal was to make a study tool that is{" "}
        <strong>simple, affordable, and accessible</strong>, especially for people who may not want to
        spend a lot of money preparing for the citizenship exam.
      </p>

      <h2>About the Questions</h2>
      <p>
        The questions used in this reviewer are based on material from the official Canadian
        citizenship study guide,{" "}
        <strong>Discover Canada: The Rights and Responsibilities of Citizenship</strong>.
      </p>
      <p>
        These are the same materials I used when I studied for my own citizenship exam. While the
        questions here are adapted into practice formats like quizzes and flashcards, the goal is to
        help you become familiar with the knowledge covered in the official guide.
      </p>

      <h2>Work in Progress</h2>
      <p>
        Because this is a small independent project, the site is <strong>still evolving</strong>.
      </p>
      <p>
        I&apos;ve done my best to debug the code and review the questions carefully, but there may
        still be occasional errors or things that could be improved. If you ever notice something
        that doesn&apos;t look right, please feel free to{" "}
        <Link href="/contact" className="text-primary hover:underline">
          let me know
        </Link>
        . Your feedback helps make the tool better for everyone.
      </p>
      <p>Over time I plan to continue improving the site and adding features such as:</p>
      <ul>
        <li>More practice questions</li>
        <li>Improved flashcards</li>
        <li>Better progress tracking</li>
        <li>Additional study tools</li>
      </ul>

      <h2>A Small Note of Encouragement</h2>
      <p>
        Preparing for the citizenship exam is more than just passing a test. It represents a
        meaningful step toward becoming part of a new community and shaping the future for yourself
        and your family.
      </p>
      <p>Thank you very much for supporting this small project. And most importantly:</p>
      <p className="text-foreground font-semibold">
        Congratulations on making one of the best investments you can make — preparing for your
        Canadian citizenship.
      </p>
    </ContentPageLayout>
  );
}
