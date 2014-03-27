describe('Recorded event model', function (t) {

    var model = new Siesta.Recorder.RecordedEvent({
        offset : ''
    })

    t.isDeeply(model.parseOffset('10,10'), [10,10]);
    t.isDeeply(model.parseOffset('10%,10'), ["10%",10]);
    t.isDeeply(model.parseOffset('10,10%'), [10,"10%"]);
    t.isDeeply(model.parseOffset('10%,10%'), ["10%","10%"]);
    t.isDeeply(model.parseOffset('10%-30,10%+4'), ["10%-30","10%+4"]);
})