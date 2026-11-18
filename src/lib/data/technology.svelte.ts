export type TechnologyBranch = 'Economy' | 'Religion' | 'Military';

export type TechnologyRequirement = {
	branch: TechnologyBranch;
	level: number;
	name: string;
	mode?: 'unlock' | 'upgrade';
};

export type TechnologyProgress = Record<TechnologyBranch, number>;

export const technologyProgressContext = Symbol('technology-progress');

export function isTechnologyUnlocked(
	progress: TechnologyProgress,
	requirement: TechnologyRequirement
) {
	return progress[requirement.branch] >= requirement.level;
}
