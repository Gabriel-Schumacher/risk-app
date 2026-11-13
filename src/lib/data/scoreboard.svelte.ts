import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const playerColors = ['blue', 'red', 'green', 'yellow', 'purple', 'orange'] as const;
export type PlayerColor = (typeof playerColors)[number];

export type ScoreboardPlayer = {
	id: string;
	color: PlayerColor;
	victory_points: number;
	created_at: string;
	updated_at: string;
};

const playerColumns = 'id,color,victory_points,created_at,updated_at';
export const playerStorageKey = 'risk-app-scoreboard-player-id';

export const scoreboard = $state({
	players: [] as ScoreboardPlayer[],
	configured: false,
	loaded: false,
	loading: false,
	error: ''
});

let client: SupabaseClient | null = null;
let channelStarted = false;
let initialization: Promise<void> | null = null;

function getClient() {
	const url = import.meta.env.VITE_SUPABASE_URL;
	const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

	if (!url || !anonKey) return null;
	client ??= createClient(url, anonKey);
	return client;
}

function errorMessage(error: unknown) {
	return error instanceof Error ? error.message : 'An unexpected scoreboard error occurred.';
}

function databaseError(error: { code?: string; message: string }) {
	if (error.code === '23505') {
		return new Error('That color is already in use by another player.');
	}
	return new Error(error.message);
}

export async function refreshScoreboard() {
	const supabase = getClient();
	if (!supabase) {
		scoreboard.configured = false;
		scoreboard.error =
			'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to connect the shared scoreboard.';
		return;
	}

	scoreboard.configured = true;
	const { data, error } = await supabase
		.from('players')
		.select(playerColumns)
		.order('created_at', { ascending: true });

	if (error) throw databaseError(error);
	scoreboard.players = (data ?? []) as ScoreboardPlayer[];
	scoreboard.loaded = true;
	scoreboard.error = '';
}

export function startScoreboard() {
	if (initialization) return initialization;
	const supabase = getClient();
	if (!supabase) {
		scoreboard.configured = false;
		scoreboard.error =
			'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to connect the shared scoreboard.';
		return Promise.resolve();
	}

	scoreboard.configured = true;
	scoreboard.loading = true;
	initialization = (async () => {
		if (!channelStarted) {
			channelStarted = true;
			supabase
				.channel('public-players-scoreboard')
				.on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, () => {
					void refreshScoreboard().catch((error: unknown) => {
						scoreboard.error = errorMessage(error);
					});
				})
				.subscribe((status) => {
					if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
						scoreboard.error = 'Live scoreboard updates are unavailable. Try refreshing.';
					}
				});
		}

		await refreshScoreboard();
	})()
		.catch((error: unknown) => {
			scoreboard.error = errorMessage(error);
		})
		.finally(() => {
			scoreboard.loading = false;
			initialization = null;
		});

	return initialization;
}

export async function claimPlayerColor(color: PlayerColor, currentPlayerId: string | null) {
	const supabase = getClient();
	if (!supabase) throw new Error('The shared scoreboard is not configured.');

	if (currentPlayerId) {
		const { data, error } = await supabase
			.from('players')
			.update({ color })
			.eq('id', currentPlayerId)
			.select(playerColumns)
			.maybeSingle();

		if (error) throw databaseError(error);
		if (data) {
			await refreshScoreboard();
			return data as ScoreboardPlayer;
		}
	}

	const { data, error } = await supabase
		.from('players')
		.insert({ color })
		.select(playerColumns)
		.single();

	if (error) throw databaseError(error);
	await refreshScoreboard();
	return data as ScoreboardPlayer;
}

export async function updateVictoryPoints(playerId: string, victoryPoints: number) {
	const supabase = getClient();
	if (!supabase) throw new Error('The shared scoreboard is not configured.');
	if (!Number.isInteger(victoryPoints) || victoryPoints < 0 || victoryPoints > 10) {
		throw new Error('Victory points must be between 0 and 10.');
	}

	const { data, error } = await supabase
		.from('players')
		.update({ victory_points: victoryPoints })
		.eq('id', playerId)
		.select(playerColumns)
		.maybeSingle();

	if (error) throw databaseError(error);
	if (!data) throw new Error('This player could not be found. Select a color again.');
	await refreshScoreboard();
	return data as ScoreboardPlayer;
}

export async function releasePlayerColor(playerId: string) {
	const supabase = getClient();
	if (!supabase) throw new Error('The shared scoreboard is not configured.');

	const { error } = await supabase.from('players').delete().eq('id', playerId);
	if (error) throw databaseError(error);
	await refreshScoreboard();
}
