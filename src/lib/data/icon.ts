type Resource = 'brick' | 'wood' | 'sheep' | 'wheat' | 'ore';

export const resourceInfo: Record<
	Resource,
	{ label: string; icon: string; tone: string; color: string }
> = {
	brick: { label: 'Brick', icon: 'B', tone: 'brick', color: '#8C1A00' },
	wood: { label: 'Lumber', icon: 'W', tone: 'wood', color: '#8C6044' },
	sheep: { label: 'Livestock', icon: 'L', tone: 'sheep', color: '#ffffff' },
	wheat: { label: 'Grain', icon: 'G', tone: 'wheat', color: '#FFD700' },
	ore: { label: 'Ore', icon: 'O', tone: 'ore', color: '#808080' }
};
