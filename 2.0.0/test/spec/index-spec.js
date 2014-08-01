KISSY.add(function (S, Node,Demo) {
    var $ = Node.all;
    describe('sapper', function () {
        it('Instantiation of components',function(){
            var demo = new Demo();
            expect(S.isObject(demo)).toBe(true);
        })
    });

},{requires:['node','kg/sapper/2.0.0/']});