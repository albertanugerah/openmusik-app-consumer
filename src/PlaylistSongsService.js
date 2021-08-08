const { Pool } = require('pg');
const InvariantError = require('./exceptions/InvariantError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSong(playlistId, userId) {
    const query = {
      text: `SELECT songs.* from playlistsongs
      LEFT JOIN songs ON songs.id = playlistsongs.song_id
      LEFT JOIN playlists ON playlists.id = playlistsongs.playlist_id
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      WHERE playlistsongs.playlist_id = $1 OR collaborations.user_id = $2
      GROUP BY songs.id`,
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows) {
      throw new InvariantError('playlist tidak ditemukan');
    }
    return result.rows;
  }
}
module.exports = PlaylistSongsService;
