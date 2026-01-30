export const API_BASE_URL = '/api';

export const CATEGORIES = [
  { value: 'education', label: 'Education' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'environment', label: 'Environment' },
  { value: 'economy', label: 'Economy' },
  { value: 'social', label: 'Social' },
  { value: 'other', label: 'Other' },
];

export const STATUSES = {
  proposal: [
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'implemented', label: 'Implemented' },
  ],
  feedback: [
    { value: 'new', label: 'New' },
    { value: 'acknowledged', label: 'Acknowledged' },
    { value: 'addressed', label: 'Addressed' },
    { value: 'closed', label: 'Closed' },
  ],
};

export const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export const FEEDBACK_CATEGORIES = [
  { value: 'suggestion', label: 'Suggestion' },
  { value: 'concern', label: 'Concern' },
  { value: 'question', label: 'Question' },
  { value: 'support', label: 'Support' },
  { value: 'opposition', label: 'Opposition' },
];

export const TIME_FILTERS = [
  { value: '', label: 'All Time' },
  { value: 'last_hour', label: 'Last Hour' },
  { value: 'last_day', label: 'Last Day' },
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
];
