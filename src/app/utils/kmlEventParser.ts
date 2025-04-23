interface KMLEvent {
    name: string;
    scheduledTime: string;
    completionTime: string;
    type: 'photo' | 'upload' | 'signal';
    status: 'scheduled' | 'completed';
    coordinates: number[];
}

export const parseKMLEvents = async (): Promise<KMLEvent[]> => {
    const response = await fetch('/SatellitesOrbits.kml');
    const kmlText = await response.text();
    const parser = new DOMParser();
    const kmlDoc = parser.parseFromString(kmlText, 'text/xml');

    const events: KMLEvent[] = [];
    const placemarks = kmlDoc.getElementsByTagName('Placemark');

    // Helper to determine event type from name or style
    const getEventType = (name: string, styleUrl: string): 'photo' | 'upload' | 'signal' => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('photo')) return 'photo';
        if (lowerName.includes('upload')) return 'upload';
        if (lowerName.includes('signal')) return 'signal';
        
        // Fallback to checking style
        if (styleUrl.includes('Photo')) return 'photo';
        if (styleUrl.includes('Upload')) return 'upload';
        if (styleUrl.includes('Signal')) return 'signal';
        
        return 'photo'; // default fallback
    };

    for (let i = 0; i < placemarks.length; i++) {
        const placemark = placemarks[i];
        const name = placemark.getElementsByTagName('name')[0]?.textContent || '';
        
        // Skip the orbit placemark
        if (name === 'Orbit') continue;
        
        const timeSpan = placemark.getElementsByTagName('TimeSpan')[0];
        const styleUrl = placemark.getElementsByTagName('styleUrl')[0]?.textContent || '';
        const coordinates = placemark.getElementsByTagName('coordinates')[0]?.textContent || '';
        
        if (timeSpan && !name.toLowerCase().includes('scheduled')) {
            const begin = timeSpan.getElementsByTagName('begin')[0]?.textContent || '';
            const end = timeSpan.getElementsByTagName('end')[0]?.textContent || '';
            
            // Parse coordinates
            const [lon, lat, alt] = coordinates.trim().split(',').map(Number);
            
            events.push({
                name,
                scheduledTime: begin,
                completionTime: end,
                type: getEventType(name, styleUrl),
                status: 'scheduled',
                coordinates: [lon, lat, alt]
            });
        }
    }

    return events
}; 