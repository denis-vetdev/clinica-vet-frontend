import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConsultaService } from 'src/app/core/services/consulta.service';
import { AnimalService } from 'src/app/core/services/animal.service';
import { VeterinarioService } from 'src/app/core/services/veterinario.service';
import { Consulta } from 'src/app/shared/models/consulta.model';
import { Animal } from 'src/app/shared/models/animal.model';
import { Veterinario } from 'src/app/shared/models/veterinario.model';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css'],
})
export class ConsultasComponent implements OnInit {
  consultas: Consulta[] = [];
  animais: Animal[] = [];
  veterinarios: Veterinario[] = [];
  colunas = [
    'animal_nome',
    'veterinario_nome',
    'data_hora',
    'motivo',
    'status',
    'acoes',
  ];
  horarios = [
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
  ];
  horarioSelecionado = '';
  dataSelecionada: Date | null = null;
  loading = false;
  mostrarFormulario = false;
  editando: Consulta | null = null;
  filtroStatus = '';
  form: FormGroup;

  statusOpcoes = [
    { value: 'agendada', label: 'Agendada' },
    { value: 'realizada', label: 'Realizada' },
    { value: 'cancelada', label: 'Cancelada' },
  ];

  constructor(
    private consultaService: ConsultaService,
    private animalService: AnimalService,
    private veterinarioService: VeterinarioService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      animal: ['', Validators.required],
      veterinario: ['', Validators.required],
      data_hora: ['', Validators.required],
      motivo: ['', Validators.required],
      status: ['agendada', Validators.required],
      observacoes: [''],
    });
  }

  ngOnInit(): void {
    this.carregar();
    this.animalService
      .listar()
      .subscribe((res) => (this.animais = res.results));
    this.veterinarioService
      .listar()
      .subscribe((res) => (this.veterinarios = res.results));
  }

  carregar(status?: string): void {
    this.loading = true;
    this.consultaService.listar(undefined, status).subscribe({
      next: (res) => {
        this.consultas = res.results;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  filtrar(status: string): void {
    this.filtroStatus = status;
    this.carregar(status || undefined);
  }

  abrirFormulario(consulta?: Consulta): void {
    this.editando = consulta || null;
    this.mostrarFormulario = true;
    if (consulta) {
      this.form.patchValue(consulta);
      const data = new Date(consulta.data_hora);
      this.dataSelecionada = data;
      const hora = data.getHours().toString().padStart(2, '0');
      const minuto = data.getMinutes().toString().padStart(2, '0');
      this.horarioSelecionado = `${hora}:${minuto}`;
    } else {
      this.form.reset({ status: 'agendada' });
      this.dataSelecionada = null;
      this.horarioSelecionado = '';
    }
  }

  fecharFormulario(): void {
    this.mostrarFormulario = false;
    this.editando = null;
    this.form.reset();
  }

  salvar(): void {
    if (
      this.form.invalid ||
      !this.horarioSelecionado ||
      !this.dataSelecionada
    ) {
      this.snackBar.open('Preencha todos os campos obrigatórios.', 'Fechar', {
        duration: 3000,
      });
      return;
    }

    const data = new Date(this.dataSelecionada);
    const [hora, minuto] = this.horarioSelecionado.split(':');
    data.setHours(parseInt(hora), parseInt(minuto), 0);

    const dataFormatada = data.toISOString().slice(0, 16);
    const dados = { ...this.form.value, data_hora: dataFormatada };

    if (this.editando?.id) {
      this.consultaService.atualizar(this.editando.id, dados).subscribe({
        next: () => {
          this.snackBar.open('Consulta atualizada!', 'Fechar', {
            duration: 3000,
          });
          this.fecharFormulario();
          this.carregar(this.filtroStatus || undefined);
        },
        error: () =>
          this.snackBar.open('Erro ao atualizar.', 'Fechar', {
            duration: 3000,
          }),
      });
    } else {
      this.consultaService.criar(dados).subscribe({
        next: () => {
          this.snackBar.open('Consulta agendada!', 'Fechar', {
            duration: 3000,
          });
          this.fecharFormulario();
          this.carregar(this.filtroStatus || undefined);
        },
        error: () =>
          this.snackBar.open('Erro ao agendar.', 'Fechar', { duration: 3000 }),
      });
    }
  }

  deletar(id: number): void {
    if (!confirm('Deseja excluir esta consulta?')) return;
    this.consultaService.deletar(id).subscribe({
      next: () => {
        this.snackBar.open('Consulta excluída!', 'Fechar', { duration: 3000 });
        this.carregar(this.filtroStatus || undefined);
      },
      error: () =>
        this.snackBar.open('Erro ao excluir.', 'Fechar', { duration: 3000 }),
    });
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      agendada: 'badge agendada',
      realizada: 'badge realizada',
      cancelada: 'badge cancelada',
    };
    return classes[status] || 'badge';
  }
}
