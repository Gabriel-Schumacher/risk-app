type Resource = 'brick' | 'wood' | 'sheep' | 'wheat' | 'ore';

export const resourceInfo: Record<
	Resource,
	{ label: string; icon: string; tone: string; color: string }
> = {
	brick: { label: 'Brick', icon: '◆', tone: 'brick', color: '#8C1A00' },
	wood: { label: 'Lumber', icon: '✦', tone: 'wood', color: '#8C6044' },
	sheep: { label: 'Wool', icon: '✺', tone: 'sheep', color: '#ffffff' },
	wheat: { label: 'Wheat', icon: '✤', tone: 'wheat', color: '#FFD700' },
	ore: { label: 'Ore', icon: '⬡', tone: 'ore', color: '#808080' }
};
