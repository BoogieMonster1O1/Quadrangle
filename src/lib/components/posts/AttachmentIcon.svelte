<script lang="ts">
  import { faMultiply, faSpinner } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import { getAuthTokenClient } from '$lib/auth';
  import { uploadToR2 } from '$lib/upload';
  import { fade } from 'svelte/transition';
  import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

  export let file: File;
  export let onDelete: () => void;

  let imageUrl: string | undefined;
  let showModal = false;

  const renderFileAsImage = async () => {
    if (!file) return;

    const reader = new FileReader();
      reader.onload = () => {
        imageUrl = reader.result as string;
    };

    reader.readAsDataURL(file);
  };

  $: renderFileAsImage();
</script>

<style>
  .spinner {
    animation: spin 1s linear infinite;
  }

</style>

<button on:click={() => { showModal = true; }} class="p-1 rounded-md transition dark:bg-neutral-700 hover:dark:bg-neutral-800 bg-neutral-200 hover:bg-neutral-300">
  {#if imageUrl}
    <img src={imageUrl} alt="Attachment" class="max-md:w-full md:max-h-40 object-contain"/>
  {:else}
    <!-- TODO use the Spinner component I created -->
    <span class="spinner">
      <Fa size={"lg"} icon={faSpinner}  />
    </span>
  {/if}
</button>

{#if showModal}
  <button on:click={() => showModal = false} class="cursor-default fixed inset-0 z-50 flex items-center justify-center transition">
    <div transition:fade={{ duration: 150 }} class="absolute inset-0 bg-black opacity-50"></div>
    <div transition:scale={{ duration: 200, start: 0, easing: quintOut }} class="relative rounded-lg p-8 max-w-md">
      <div class="flex flex-col gap-4 justify-center items-center">
        <img src={imageUrl} alt="Attachment" class="object-contain max-w-screen-sm" />
        <button class="btn-cancel px-2 py-1" on:click|preventDefault={onDelete}>Delete</button>
      </div>
    </div>
  </button>
{/if}
