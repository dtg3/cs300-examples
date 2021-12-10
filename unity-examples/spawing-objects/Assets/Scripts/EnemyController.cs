using UnityEngine;

public class EnemyController : MonoBehaviour
{
    private GameObject player;
    private CharacterController controller;
    [SerializeField] private float speed = 4.0f;

    private Vector3 enemyVerticalVelocity;
    private bool grounded;
    private float gravityValue = -9.8f;
    // Start is called before the first frame update
    void Awake()
    {
        player = GameObject.FindGameObjectWithTag("Player");
        controller = GetComponent<CharacterController>();
    }

    // Update is called once per frame
    void Update()
    {   
        if (player && player.activeInHierarchy)
        {
            if (controller.isGrounded && enemyVerticalVelocity.y < 0)
            {
                enemyVerticalVelocity.y = 0.0f;
            }

            Vector3 direction = (player.transform.position -
                transform.position).normalized;
            transform.LookAt(player.transform.position);
            controller.Move(direction * speed * Time.deltaTime);

            enemyVerticalVelocity.y += gravityValue * Time.deltaTime;
            controller.Move(enemyVerticalVelocity * Time.deltaTime);
        }
    }

    void OnControllerColliderHit(ControllerColliderHit other)
    {
        if (other.gameObject.CompareTag("Player"))
        {
            other.gameObject.SetActive(false);
        }
    }
}
