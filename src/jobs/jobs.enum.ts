export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
  FREELANCE = 'freelance',
}

export enum JobLocation {
  REMOTE = 'remote',
  ONSITE = 'onsite',
  HYBRID = 'hybrid',
}

export enum JobExperience {
  JUNIOR = 'junior',
  SENIOR = 'senior',
  INTERMEDIATE = 'intermediate',
}

export enum JobProfession {
  MARKETER = 'marketer',
  UX_DESIGNER = 'ux designer',
  ACCOUNTANT = 'accountant',
  APP_DEVELOPER = 'app developer',
  PRODUCT_MANAGER = 'product manager',
  SOFTWARE_ENGINEER = 'software engineer',
  GRAPHICS_DESIGNER = 'graphics designer',
}

export enum JobPayFrequency {
  YEARLY = 'yearly',
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
  DAILY = 'daily',
  HOURLY = 'hourly',
}

export enum JobStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export enum JobApplicationStatus {
  APPLIED = 'applied',
  REVIEWING = 'reviewing',
  INTERVIEWING = 'interviewing',
  HIRED = 'hired',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

export enum JobApplicationTimelineStage {
  APPLIED = 'applied',
  REVIEWED = 'reviewed',
  SCREENING_INTERVIEW = 'screening interview',
  TECHNICAL_INTERVIEW = 'technical interview',
  HR_INTERVIEW = 'hr interview',
  ONBOARDING = 'onboarding',
  HIRED = 'hired',
  CLOSED = 'closed',
  REJECTED = 'rejected',
}

export enum JobApplicationTimelineStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  ARCHIVED = 'archived',
}
