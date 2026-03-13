import { Component, OnInit } from '@angular/core';
import { TutorService } from 'src/app/core/services/tutor.service';
import { AnimalService } from 'src/app/core/services/animal.service';
import { VeterinarioService } from 'src/app/core/services/veterinario.service';
import { ConsultaService } from 'src/app/core/services/consulta.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalTutores = 0;
  totalAnimais = 0;
  totalVeterinarios = 0;
  consultasHoje: any[] = [];
  loading = true;

  constructor(
    private tutorService: TutorService,
    private animalService: AnimalService,
    private veterinarioService: VeterinarioService,
    private consultaService: ConsultaService
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.tutorService.listar().subscribe(res => this.totalTutores = res.count);
    this.animalService.listar().subscribe(res => this.totalAnimais = res.count);
    this.veterinarioService.listar().subscribe(res => {
      this.totalVeterinarios = res.count;
      this.loading = false;
    });
    this.consultaService.listar(undefined, 'agendada').subscribe(res => {
      this.consultasHoje = res.results.slice(0, 5);
    });
  }
}
