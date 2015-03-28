Polymer('multigame-view', {
    height: 250,
    width: 250,
    score: 100,
    gameKey: false,
    computed: {
        halfTheWidth: 'width / 2'
    },
    ready: function() {
        this.gameKey = Web.MultiplayerGames.add();
    }
});