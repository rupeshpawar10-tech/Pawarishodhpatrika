import { JobRecord, JobPriority, JobStatus, JobType, SupportedModule } from '../types/enterprise';

const STORAGE_KEY = 'satpura_jobs_v1';

const INITIAL_JOBS: JobRecord[] = [
  {
    jobId: 'JOB-0001',
    jobType: 'search_reindex',
    module: 'citations',
    priority: 'high',
    status: 'completed',
    progress: 100,
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    finishedAt: new Date(Date.now() - 3500000).toISOString(),
    createdBy: 'admin@taaptiresearch.org',
    createdAt: new Date(Date.now() - 3700000).toISOString(),
    updatedAt: new Date(Date.now() - 3500000).toISOString(),
    retryCount: 0,
    logs: [
      { timestamp: new Date(Date.now() - 3700000).toISOString(), message: 'Job enqueued in FIFO queue', level: 'info' },
      { timestamp: new Date(Date.now() - 3600000).toISOString(), message: 'Started reindexing 1,240 records across all modules', level: 'info' },
      { timestamp: new Date(Date.now() - 3500000).toISOString(), message: 'Successfully completed search index build', level: 'info' }
    ]
  },
  {
    jobId: 'JOB-0002',
    jobType: 'corpus_processing',
    module: 'corpus',
    priority: 'normal',
    status: 'running',
    progress: 65,
    startedAt: new Date(Date.now() - 600000).toISOString(),
    createdBy: 'editor@taaptiresearch.org',
    createdAt: new Date(Date.now() - 900000).toISOString(),
    updatedAt: new Date(Date.now() - 600000).toISOString(),
    retryCount: 0,
    logs: [
      { timestamp: new Date(Date.now() - 900000).toISOString(), message: 'Audio stream received for transcription', level: 'info' },
      { timestamp: new Date(Date.now() - 600000).toISOString(), message: 'Running Whisper AI speech-to-text model on Satpura Pawari audio', level: 'info' }
    ]
  }
];

export const JobQueueService = {
  getJobs: (): JobRecord[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_JOBS));
        return INITIAL_JOBS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_JOBS;
    }
  },

  createJob: (jobType: JobType, module: SupportedModule, priority: JobPriority = 'normal', recordId?: string): JobRecord => {
    const list = JobQueueService.getJobs();
    const newJob: JobRecord = {
      jobId: `JOB-${Math.floor(1000 + Math.random() * 9000)}`,
      jobType,
      module,
      recordId,
      priority,
      status: 'queued',
      progress: 0,
      createdBy: 'admin@taaptiresearch.org',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      retryCount: 0,
      logs: [
        { timestamp: new Date().toISOString(), message: `Job ${jobType} enqueued successfully`, level: 'info' }
      ]
    };
    list.unshift(newJob);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('jobs_changed'));
    return newJob;
  },

  updateJobStatus: (jobId: string, status: JobStatus, progress?: number, logMessage?: string) => {
    const list = JobQueueService.getJobs();
    const job = list.find(j => j.jobId === jobId);
    if (job) {
      job.status = status;
      if (progress !== undefined) job.progress = progress;
      if (status === 'running' && !job.startedAt) job.startedAt = new Date().toISOString();
      if (status === 'completed' || status === 'failed') job.finishedAt = new Date().toISOString();
      if (logMessage) {
        job.logs.push({ timestamp: new Date().toISOString(), message: logMessage, level: status === 'failed' ? 'error' : 'info' });
      }
      job.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event('jobs_changed'));
    }
  }
};
