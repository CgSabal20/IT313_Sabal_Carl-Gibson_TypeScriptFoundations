import getStatus, {
    computeAverage,
    EnrollmentStatus
} from './gradeUtils';

interface Enrollee {
  name: string;
  prelim: number;
  midterm: number;
  final: number;
}

interface EligibilityReport {
  name: string;
  average: number;
  status: EnrollmentStatus;
  remarks?: string;
}

type Batchid = string | number;

let batchid: Batchid = 313;

if (typeof batchid === "number") {
  console.log(`Batch ID is a number: ${batchid}`);
} else {
  console.log(`Batch ID is a string: ${batchid}`);
}

const enrollees: Enrollee[] = [
  { name: "Ana Cruz", prelim: 85, midterm: 90, final: 88 },
  { name: "Bea Santos", prelim: 70, midterm: 65, final: 60 },
  { name: "Cid Ramos", prelim: 95, midterm: 92, final: 97 },
  { name: "Dex Alonzo", prelim: 60, midterm: 55, final: 50 },
  { name: "Eli Tan", prelim: 78, midterm: 80, final: 76 },
];

function getEnrollees(): Promise<Enrollee[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(enrollees);
    }, 1000);
  });
}

function groupBy<T>(
  items: T[],
  keyFn: (item: T) => string,
): Record<string, T[]> {
  return items.reduce(
    (groups, item) => {
      const key = keyFn(item);

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(item);

      return groups;
    },
    {} as Record<string, T[]>,
  );
}

async function generateReport(): Promise<void> {
  try {
    const students = await getEnrollees();

    const reports: EligibilityReport[] = students.map((student) => {
      const average = computeAverage(
        student.prelim,
        student.midterm,
        student.final,
      );

      const status = getStatus(average);

      if (status === EnrollmentStatus.Probation) {
        return {
          name: student.name,
          average,
          status,
          remarks: "Needs consultation",
        };
      }

      return {
        name: student.name,
        average,
        status,
      };
    });

    const classAverage =
      reports.reduce((total, report) => total + report.average, 0) /
      reports.length;

    const groupedReports = groupBy(reports, (report) => report.status);

    const passingCount = groupedReports[EnrollmentStatus.Passing]?.length ?? 0;

    console.log(`=== IT313 Enrollment Eligibility Report (TypeScript) ===`);

    reports.forEach((report) => {
      const remarks = report.remarks ? ` - ${report.remarks}` : "";

      console.log(
        `${report.name} - Average: ${report.average.toFixed(2)} - ${report.status}${remarks}`,
      );
    });

    console.log(`Class Average: ${classAverage.toFixed(2)}`);

    console.log(`Passing: ${passingCount} / ${reports.length}`);
  } catch (error) {
    console.error(
      "Failed to connect to the registrar API. Please try again later.",
    );
  }
}

generateReport();
