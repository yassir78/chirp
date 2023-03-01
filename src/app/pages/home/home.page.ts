import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  segment = 'home';
  chirps: any[] = [
    {
      img: "https://i.pravatar.cc/150?img=1",
      name: "John Doe",
      handle: "johndoe",
      date: "2022-10-01",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      rechirp: true
    },
    {
      img: "https://i.pravatar.cc/150?img=2",
      name: "Jane Smith",
      handle: "janesmith",
      // timestamp
      date: Date.now(),
      text: "Praesent ac ex id mi sagittis sollicitudin eget et nulla.",
      attachment: "https://picsum.photos/200/300",
      liked: true,
    },
    {
      img: "https://i.pravatar.cc/150?img=3",
      name: "Bob Johnson",
      handle: "bobjohnson",
      date: "2022-10-03",
      text: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod suscipit libero, a luctus augue bibendum vel."
    },
    {
      img: "https://i.pravatar.cc/150?img=4",
      name: "Alice Lee",
      handle: "alicelee",
      date: "2022-10-04",
      text: "Maecenas suscipit, eros at efficitur tempus, nisl augue scelerisque metus, eu aliquet eros ex quis metus."
    },
    {
      img: "https://i.pravatar.cc/150?img=5",
      name: "David Chen",
      handle: "davidchen",
      date: "2022-10-05",
      text: "Suspendisse eget mauris tincidunt, suscipit leo vitae, pharetra massa."
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
