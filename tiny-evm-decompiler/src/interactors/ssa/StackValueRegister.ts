
export class StackValueRegister {
    private stack = [];

    private location = 0;

    private counter = 0;

    public duplicateValue(){
        this.stack.push(this.stack[this.stack.length - 1]);
    }

    public registerValue() {
        this.counter++;
        this.stack.push(this.counter);
        return this.counter;
    }

    public popValue({count}: {count: number}){
        return [...new Array(count)].map(() =>{
            if (this.stack.length <= 0){
                return `sp = ?`
            }
            const index = this.stack.pop();
            return `%${index}`;
        })
    }
}
