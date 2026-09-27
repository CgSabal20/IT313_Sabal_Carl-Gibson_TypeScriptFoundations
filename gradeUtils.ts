export enum EnrollmentStatus {
    Passing = 'PASSING',
    Probation = 'PROBATION'
}

export function computeAverage(
    prelim: number,
    midterm: number,
    final: number
): number {
    return (prelim + midterm + final) / 3;
}

export default function getStatus(
    average: number
): EnrollmentStatus {
    if (average >= 75) {
        return EnrollmentStatus.Passing;
    } else {
        return EnrollmentStatus.Probation;
    }
}