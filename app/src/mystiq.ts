import { v4 as uuidv4 } from 'uuid';

export interface INodeMethods {
    getType(): 'question' | 'response';
    getMessage(): string;
    getId(): string;
    getRight(): INodeMethods | null;
    getLeft(): INodeMethods | null;
    setRight(value: INodeMethods): INodeMethods | never;
    setLeft(value: INodeMethods): INodeMethods | never;
}

abstract class NodeStruct implements INodeMethods {

    protected readonly id: string = uuidv4();

    abstract getType(): "question" | "response" ;
    abstract getMessage(): string;
    abstract getRight(): INodeMethods | null ;
    abstract getLeft(): INodeMethods | null ;
    abstract setRight(value: NodeStruct): INodeMethods | never ;
    abstract setLeft(value: NodeStruct): INodeMethods | never ;

    public getId(): string {
        return this.id;
    }
}

export class NodeQuestion extends NodeStruct {

    private left : NodeStruct | null = null;
    private right: NodeStruct | null = null;

    constructor(public readonly question: string){
        super();
    }

    getType(): "question" | "response" {
        return "question";
    }

    getMessage(): string {
        return this.question;
    }

    getRight(): INodeMethods | null {
        return this.right;
    }

    getLeft(): INodeMethods | null {
        return this.left;
    }

    setRight(value: NodeStruct): INodeMethods {
        this.right = value;
        return this;
    }
    setLeft(value: NodeStruct): INodeMethods {
        this.left = value;
        return this;
    }
}

export class NodeResponse extends NodeStruct {

    constructor(public readonly response: string){
        super();
    }

    getType(): "question" | "response" {
        return "response";
    }

    getMessage(): string {
        return this.response;
    }

    getRight(): INodeMethods | null {
        return null;
    }

    getLeft(): INodeMethods | null {
        return null;
    }

    setRight(value: NodeStruct): never {
        throw new Error(`Nope`);
    }
    setLeft(value: NodeStruct): never {
        throw new Error(`Nope`);
    }
}

let nodeRoot: INodeMethods | null = null ;

// Ronaldo

// 1 - Personnalité célèbre
// 2 - Fait du foot
// 3 - Homme ou autre
// 4 - Portugais
// 5 - Famille
// 6 - 6 ballon d'or

const nodePersonnality: INodeMethods = new NodeQuestion( 'Est-ce une personnalité célèbre' );
const nodeFoot: INodeMethods = new NodeQuestion( 'Est-ce un footballeur' );
const nodeMen: INodeMethods = new NodeQuestion( 'Est-ce un homme' );
const nodePortugese: INodeMethods = new NodeQuestion( 'Est-il portugais' );
const nodeFamilly: INodeMethods = new NodeQuestion( `A-t-il une famille` );
const node6gold: INodeMethods = new NodeQuestion( `Possède t'il 6 ballons d'or` );
const nodeNope: INodeMethods = new NodeResponse( `Je ne connais pas la réponse` );

console.log({
    nodePersonnality: nodePersonnality.getId(),
    nodeFoot: nodeFoot.getId(),
    nodeMen: nodeMen.getId(),
    nodePortugese: nodePortugese.getId(),
    nodeFamilly: nodeFamilly.getId(),
    node6gold: node6gold.getId(),
});

const nodeRonaldo: INodeMethods = new NodeResponse('Ronaldo !');

nodePersonnality
    .setLeft(nodeFoot)
    .setRight(nodeNope);
nodeFoot
    .setLeft(nodeMen)
    .setRight(nodeNope);
nodeMen
    .setLeft(nodePortugese)
    .setRight(nodeNope);
nodePortugese
    .setLeft(nodeFamilly)
    .setRight(nodeNope);
nodeFamilly
    .setLeft(node6gold)
    .setRight(nodeNope);
node6gold
    .setLeft(nodeRonaldo)
    .setRight(nodeNope);

nodeRoot = nodePersonnality;

let currentNode: INodeMethods | null = nodeRoot;

do {
    // console.log(`
    //     Id -> ${currentNode?.getId()}    
    //     Type -> ${currentNode?.getType()}
    //     Message -> ${currentNode?.getMessage()}
    //     OUI -> ${currentNode?.getLeft()?.getId()}
    //     NON -> ${currentNode?.getRight()?.getId()}
    // `);

    if( currentNode.getType() === 'question' ){
        console.log(`Question : ${currentNode?.getMessage()} ?`);

        
    } 

    currentNode = currentNode?.getLeft();

} while( currentNode !== null ) ;
