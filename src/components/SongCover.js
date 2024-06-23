export const SongCover = ({song}) => {
    return (
        <div className="songCardCover">
            <img src={song.album.cover} width={56} height={56} style={{borderRadius: 10}}/>
            <div style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "start",
                marginLeft: 4
            }}>
                <span style={{color: "white"}}>{song.name}</span>
                <div className="songCardArtists">
                    {song.artists.map((artist, i) => (
                        <a key={artist.id} href="#" className="link">
                            <small>{i !== 0 && "*"}{artist.name}</small>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
