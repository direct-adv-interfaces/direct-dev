console.log('b1.js');

var a = [34, 203, 3, 746, 200, 984, 198, 764, 9];

function bubbleSort(a)
{
    var swapped;
    do {
        swapped = false;
        for (var i=0; i < a.length-1; i++) {
            if (a[i] > a[i+1]) {
                var temp = a[i];
                a[i] = a[i+1];
                a[i+1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
}

bubbleSort(a);
console.log(a);
