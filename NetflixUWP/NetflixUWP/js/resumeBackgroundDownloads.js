(function() {
    const task = Windows.UI.WebUI.WebUIBackgroundTaskInstance.current;
    const triggerDetails = task.triggerDetails;

    const Downloader = Windows.Networking.BackgroundTransfer.BackgroundDownloader;

    function run() {
        Downloader.getCurrentDownloadsAsync()
            .done(restartDownloads, cleanUpAndQuit);
    }

    function restartDownloads(downloads) {
        for (var i = 0; i < downloads.size; i++) {
            downloads[i].attachAsync();
        }

        cleanUpAndQuit();
    }

    function cleanUpAndQuit() {
        // right now, there isn't really any cleanup. just quit

        // this "close" is a built-in function and not a locally defined one.
        // calling it is required for all background services.
        close();
    }
})();
