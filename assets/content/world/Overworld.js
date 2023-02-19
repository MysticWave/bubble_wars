class Overworld extends Dimension
{
    constructor()
    {
        super();

        this.HexMap = [
            [false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false],
            [false,false,false,false,true,true,true,true,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false],
            [true,true,true,false,true,true,true,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false],
            [true,true,true,true,true,true,true,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,true,true,false,false],
            [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,true,true,true,false,false],
            [false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,true,true,true,true,false,false],
            [false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false],
            [false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false],
            [false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false],
            [false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false],
            [false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false],
            [false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false],
            [false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false],
            [false,false,false,true,true,true,true,true,true,true,false,true,true,true,false,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false],
            [false,false,false,true,true,true,true,true,true,true,false,false,false,false,false,false,true,true,true,true,true,true,true,false,false,false,false,false,false,false],
            [false,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false],
            [false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false],
            [false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false],
            [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
            [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]
        ];
        
        // this.Points = [
        //     new HexMapPoint(1, 3, 'VILLAGE')
        // ];
    }
}
World.InitializeDimension(Overworld);