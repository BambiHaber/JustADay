class JustADay {
    constructor(options) {
        this.componentId = this.generateRandomString() + this.generateRandomString();
        this.options = options;

        this.el = this.options.el;
        this.date = this.options.date || new Date();

        this.validateConstructor(this.options);

        this.el.addEventListener('click', this.onInputClick.bind(this));

        this.elementStack = {};

        // this.dayNamesArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; //Would be in use for a later more nice thingie :)
        this.monthNamesArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        this.template = `
<div id="${this.componentId}-justday" class="justaday justadayContainer">
    <div class="paging">
        <div class="pager pageLeft"><<</div>
        <div class="pager pageRight">>></div>
    </div>
    <div class="selects">
        <div class="select-style">
            <select id="${this.componentId}-selectDay"></select>
        </div>

        <div class="select-style">
            <select id="${this.componentId}-selectMonth"></select>
        </div>

        <div class="select-style">
            <select id="${this.componentId}-selectYear"></select>
        </div>
    </div>
    <div id="${this.componentId}-daytable" class="daytable"></div>
    <div id="${this.componentId}-closeButton" class="closebutton">Ok</div>
</div>`;
    }

    show() {
        this.currentPickerElement.style.display = 'block';
    }

    hide() {
        this.currentPickerElement.style.display = 'none';
    }

    onInputClick(e) {

        let potentialElement = document.querySelector('#' + this.componentId + '-justday');
        if (potentialElement) {
            this.show()
        } else {
            let inputEl = e.currentTarget;
            let position = this.getPosition(inputEl);
            this.createPickerAtPosition(position);
        }
    }

    createPickerAtPosition(position) {
        /**
         * Base is set
         */
        this.currentPickerElement = document.createElement('div');
        this.currentPickerElement.style = `position:fixed; top:${position.x}; left:${position.y};`;
        this.currentPickerElement.innerHTML = this.template;

        /**
         * ref elements
         * @type {{selectDay: Element, selectMonth: Element, selectYear: Element}}
         */
        this.elementStack = {
            selectDay: this.currentPickerElement.querySelector(`#${this.componentId}-selectDay`),
            selectMonth: this.currentPickerElement.querySelector(`#${this.componentId}-selectMonth`),
            selectYear: this.currentPickerElement.querySelector(`#${this.componentId}-selectYear`),
            dayTable: this.currentPickerElement.querySelector(`#${this.componentId}-daytable`),
            closeButton: this.currentPickerElement.querySelector(`#${this.componentId}-closeButton`)
        };
        /**
         * init & render
         */
        this.init(this.elementStack);
        this.render(this.elementStack);

        /**
         * bind events
         */
        document.body.appendChild(this.currentPickerElement);
    }

    getPosition(el) {
        var xPos = 0;
        var yPos = 0;

        while (el) {
            if (el.tagName == "BODY") {
                // deal with browser quirks with body/window/document and page scroll
                var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
                var yScroll = el.scrollTop || document.documentElement.scrollTop;

                xPos += (el.offsetLeft - xScroll + el.clientLeft);
                yPos += (el.offsetTop - yScroll + el.clientTop);
            } else {
                // for all other non-BODY elements
                xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
                yPos += (el.offsetTop - el.scrollTop + el.clientTop);
            }

            el = el.offsetParent;
        }
        return {
            x: xPos,
            y: yPos
        };
    }

    /*

// deal with the page getting resized or scrolled
    window.addEventListener("scroll", updatePosition, false);
    window.addEventListener("resize", updatePosition, false);

    function updatePosition() {
        // add your code to update the position when your browser
        // is resized or scrolled
    }

*/

    validateConstructor(options) {
        if (!options['el'] && !this._isDomElement(options['el'])) {
            throw "[JustADay] - Please provide a valid DOM element in the parameters, example: new JustADay({el: document.querySelector('#birthdate'});";
        }
        if (options['date']) {
            console.log('[JustADay] - No date object provided.. falling back to Now!');
        }
        return true;
    }


    init(elementStack) {
        this.populateDays(elementStack.selectDay);
        this.populateMonths(elementStack.selectMonth);
        this.populateYears(elementStack.selectYear);

        elementStack.closeButton.addEventListener('click', () => {
            this.hide();
        })
    }


    render(elementStack) {
        this.renderDays(elementStack.dayTable);
    }

    _isDomElement(obj) {
        try {
            return obj instanceof HTMLElement;
        }
        catch (e) {
            return (typeof obj === "object") &&
                (obj.nodeType === 1) && (typeof obj.style === "object") &&
                (typeof obj.ownerDocument === "object");
        }
    }


    generateRandomString() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }


    getDaysInMonth(month, year) {
        var date = new Date(year, month, 1);
        var days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days
    }


    getYearRange(start, end) {
        var varFrom = start;
        var varTo = end;
        var result = [];
        while (varFrom <= varTo) {
            result.push(varFrom);
            varFrom++;
        }
        return result;
    }

    _generateSelectOption(id, value, text, selected) {
        let tempEl = document.createElement('option');
        tempEl.setAttribute('id', id);
        if (selected) {
            tempEl.setAttribute('selected', 'selected');
        }

        tempEl.value = value;
        tempEl.innerHTML = text;

        return tempEl;
    }

    populateDays(el) {
        var days = this.getDaysInMonth(this.date.getMonth(), this.date.getYear());
        let initializedDay = this.date.getDate();

        days.forEach((day) => {
            el.appendChild(this._generateSelectOption(`${this.componentId}-day-${day.getDate()}`, day.getDate(), day.getDate(), (initializedDay === day.getDate())))
        })

        el.addEventListener('change', this.onChangeDaySelect.bind(this));
    }

    populateMonths(el) {
        var months = this.monthNamesArr;
        let initializedMonth = this.date.getMonth();

        months.forEach((month, itrIdx) => {
            el.appendChild(this._generateSelectOption(`${this.componentId}-month-${itrIdx}`, itrIdx, month, (initializedMonth === itrIdx)))
        });

        el.addEventListener('change', this.onChangeMonthSelect.bind(this));
    }

    populateYears(el) {
        var yearRange = this.getYearRange(1900, new Date().getFullYear());
        let initializedYear = this.date.getFullYear();

        yearRange.forEach((year) => {
            el.appendChild(this._generateSelectOption(`${this.componentId}-year-${year}`, year, year, (initializedYear === year)))
        });

        el.addEventListener('change', this.onChangeYearSelect.bind(this));
    }

    onChangeDaySelect(e) {
        let selectedDay = e.currentTarget.value;
        this.markDaySelectedDayBox(selectedDay);
        this.date.setDate(selectedDay);
    }

    onChangeMonthSelect(e) {
        this.date.setMonth(e.currentTarget.value);
        this.renderDays(this.elementStack.dayTable);
    }

    onChangeYearSelect(e) {
        this.date.setFullYear(e.currentTarget.value);
        this.renderDays(this.elementStack.dayTable);
    }

    onChangeDayBox(dayNum) {
        this.elementStack.selectDay.value = dayNum;
    }

    markDaySelectedDayBox(dayNum) {
        Array.prototype.forEach.call(this.elementStack.dayTable.children, (child) => {
            child.classList.toggle('selected', child.innerHTML === dayNum)
        });
    }

    renderDays(dayTableEl) {
        dayTableEl.innerHTML = '';

        var days = this.getDaysInMonth(this.date.getMonth(), this.date.getYear());
        for (let i = 0; i <= days.length - 1; i++) {
            let dayBoxEl = document.createElement('div');
            dayBoxEl.classList.add('daybox');
            dayBoxEl.innerHTML = days[i].getDate();
            if (this.date.getDate() === days[i].getDate()) {
                dayBoxEl.classList.add('selected');
            }
            dayBoxEl.addEventListener('click', (e) => {
                Array.prototype.forEach.call(dayTableEl.children, (child) => {
                    child.classList.remove('selected');
                });
                e.currentTarget.classList.toggle('selected');
                this.onChangeDayBox(e.currentTarget.innerHTML);
                this.date.setDate(e.currentTarget.innerHTML);
            });
            dayTableEl.appendChild(dayBoxEl);

        }
    }
}