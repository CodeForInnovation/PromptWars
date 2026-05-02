export interface ActivityItem {
    time: string;
    msg: string;
    color: string;
  }
  
  export interface DashboardData {
    health: number;
    active_bots: number;
    blocked_dependencies: number;
    activity_stream: ActivityItem[];
  }
  
  export interface Task {
    id: string;
    title: string;
    description: string;
    assigned_to: string;
    status: 'pending' | 'blocked' | 'completed';
  }

  export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
  }
