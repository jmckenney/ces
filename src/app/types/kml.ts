export interface KMLEvent {
    name: string;
    scheduledTime: string;
    completionTime: string;
    type: 'photo' | 'upload' | 'signal';
    status: 'scheduled' | 'completed';
    coordinates: number[];
} 