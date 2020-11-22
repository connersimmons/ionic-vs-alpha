import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { IonContent, IonVirtualScroll } from "@ionic/angular";
import { Contact } from "../contact";
import { ContactsService } from "../contacts.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit, AfterViewInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("vScroll") public virtualScroll: IonVirtualScroll;

  public contacts: Array<Contact> = new Array<Contact>();
  public alphabet: String[] = [];
  public contentTop: number;
  public contentHeight: number;

  constructor(private contactsService: ContactsService) {
    this.alphabet.push(String.fromCharCode(35));
    for (let i = 0; i < 26; i++) {
      this.alphabet.push(String.fromCharCode(65 + i));
    }
  }

  ngOnInit() {
    this.contactsService.getContacts().subscribe((res) => {
      this.contacts = res["results"];
      console.log(this.contacts);
      this.contacts.sort((a, b) => (a.name.last < b.name.last ? -1 : 1));
    });
  }

  ngAfterViewInit() {
    this.content.getScrollElement().then((res: HTMLElement) => {
      this.contentTop = res.getBoundingClientRect().top;
      this.contentHeight = res.getBoundingClientRect().height;
      console.log(this.contentTop);
      console.log(this.contentHeight);
    });
  }

  myHeaderFn = (record, recordIndex, records) => {
    let result = null;
    if (recordIndex !== 0) {
      const prevRec = records[recordIndex - 1];
      const currRec = record;
      const prevName = prevRec.name.last;
      const currName = currRec.name.last;
      // console.log(prevName);
      // console.log(currName);
      if (prevName !== null && currName !== null) {
        let prevCharCode = prevName.toUpperCase().charCodeAt(0);
        let currCharCode = currName.toUpperCase().charCodeAt(0);
        if (prevCharCode !== currCharCode) {
          let prevChar = prevName.toUpperCase().charAt(0);
          let currChar = currName.toUpperCase().charAt(0);
          let prevIsLetter = this.isLetter(prevChar);
          if (!prevIsLetter) {
            let currIsLetter = this.isLetter(currChar);
            result = currIsLetter ? currName.toUpperCase().charAt(0) : null;
          } else {
            result = currName.toUpperCase().charAt(0);
          }
        }
      }
    } else {
      const name = record.name.last;
      // console.log(name);
      if (name !== null) {
        let nameChar = name.toUpperCase().charAt(0);
        let headerChar = this.isLetter(nameChar) ? nameChar : "#";
        result = headerChar.toUpperCase();
      }
    }
    return result;
  };

  public isLetter(char: any): boolean {
    return /[a-zA-Z]/.test(char);
  }

  goLetter(letter: string) {
    console.log("Letter:", letter);
    // console.log(this.groupedContacts.get(letter));
    // const firstContact = this.groupedContacts.get(letter)[0];
    const firstContact = this.contacts.find((c) => {
      return c.name.last.toUpperCase().charAt(0) === letter.toUpperCase();
    });
    console.log(firstContact);
    const wantedIndex = this.virtualScroll.items.findIndex(
      (item) => item === firstContact
    );
    this.virtualScroll.positionForItem(wantedIndex).then((offset: number) => {
      // console.log(offset);
      this.content.scrollToPoint(0, offset);
    });
  }

  needLetter(letter: string): boolean {
    let contact = this.contacts.find((c) => {
      return c.name.last.toUpperCase().charAt(0) === letter.toUpperCase();
    });
    return contact !== null;
  }

  sidebarDimensions() {
    return {
      top: `${this.contentTop}px`,
      height: `${this.contentHeight}px`,
    };
  }
}
