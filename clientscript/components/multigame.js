Polymer('multigame-view', {
    height: 250,
    width: 250,
    score: 100,
    playercount: 2,
    games: [0, 1],
    gameKey: false,
    computed: {
        halfTheWidth: 'width / playercount'
    },
    ready: function() {
        this.gameKey = Web.MultiplayerGames.add();
        this.playercount = parseInt(this.playercount);
        var games = [];
        for (var i = 0; i < this.playercount; i++) {
            games.push(i);
        }
        this.games = games;
    }
});