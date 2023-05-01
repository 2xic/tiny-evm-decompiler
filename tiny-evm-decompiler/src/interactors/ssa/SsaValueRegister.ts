
export class SsaValueRegister {
    private stack = [];

    private values = [];

    private location = 0;

    private counter = 0;

    public duplicateValue(){
        this.stack.push(this.stack[this.stack.length - 1]);
    }

    public registerValue(options?: {value: string}) {
        this.counter++;
        this.stack.push(this.counter);

        this.values.push(options?.value);

        return this.counter;
    }

    public swap(distance: number){
        const fromIndex = this.stack.length- distance;
        const toIndex = this.stack.length - 1;

        const from = this.stack[fromIndex]
        const to = this.stack[toIndex]

        this.stack[fromIndex] = to;
        this.stack[toIndex] = from;
    }

    public popValue({count}: {count: number}){
        return [...new Array(count)].map(() =>{
            if (this.stack.length <= 0){
                return `sp = ?`
            }
            const index = this.stack.pop();
            const value = this.values.pop();

            return value !== undefined ? `#${value}` : `%${index}`;
        })
    }
}
